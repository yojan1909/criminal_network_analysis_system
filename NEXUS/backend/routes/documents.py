"""
Nexus Intelligence Command Center — Document Management API routes
Handles document listing, viewing, and metadata.
"""

from fastapi import APIRouter, Query, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
from backend.database import get_db, dict_row, log_audit
from backend.ai_service import ai_service
from backend.config import config
import uuid
import os
from pathlib import Path

router = APIRouter(prefix="/api/documents", tags=["documents"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class DocumentCreate(BaseModel):
    title: str
    source_type: str = "FIR"
    case_id: Optional[str] = None
    summary: Optional[str] = ""
    raw_text: Optional[str] = ""


@router.get("")
def list_documents(
    case_id: Optional[str] = None,
    source_type: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = Query(default=50, le=100),
):
    """List all case documents with optional filters."""
    with get_db() as conn:
        query = "SELECT * FROM documents WHERE 1=1"
        params = []

        if case_id:
            query += " AND case_id = ?"
            params.append(case_id)
        if source_type:
            query += " AND source_type = ?"
            params.append(source_type)
        if q:
            query += " AND (title LIKE ? OR summary LIKE ? OR id LIKE ?)"
            qp = f"%{q}%"
            params.extend([qp, qp, qp])

        query += " ORDER BY upload_date DESC LIMIT ?"
        params.append(limit)

        rows = conn.execute(query, params).fetchall()

    return {"documents": [dict_row(r) for r in rows], "count": len(rows)}


@router.get("/{doc_id}")
def get_document(doc_id: str):
    """Get full document detail including raw text and extracted entities."""
    with get_db() as conn:
        doc = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        doc = dict_row(doc)

        # Get queued extractions from this document
        extractions = conn.execute("""
            SELECT * FROM extraction_queue WHERE document_id = ?
        """, (doc_id,)).fetchall()

    log_audit("AN-89241", "VIEW", "document", doc_id, doc.get("case_id"))

    return {
        "document": doc,
        "extractions": [dict_row(e) for e in extractions]
    }


@router.post("")
def create_document(data: DocumentCreate):
    """Register a new document record."""
    doc_id = f"DOC-{uuid.uuid4().hex[:6].upper()}"

    with get_db() as conn:
        conn.execute("""
            INSERT INTO documents (
                id, title, source_type, case_id, summary, raw_text,
                uploaded_by, ocr_status, file_type
            ) VALUES (?, ?, ?, ?, ?, ?, 'AN-89241', 'completed', 'text')
        """, (
            doc_id, data.title, data.source_type, data.case_id,
            data.summary, data.raw_text
        ))

        if data.case_id:
            conn.execute("""
                UPDATE cases SET document_count = document_count + 1 WHERE id = ?
            """, (data.case_id,))

    log_audit("AN-89241", "CREATE", "document", doc_id, data.case_id, details=f"Created {data.title}")
    return {"success": True, "document_id": doc_id, "message": f"Document {doc_id} created."}


@router.post("/upload")
async def upload_document_file(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    source_type: str = Form("Surveillance"),
    case_id: Optional[str] = Form("CS-2024-8841"),
    extract_entities: bool = Form(True)
):
    """
    Handle direct file upload (PDF, TXT, CSV, JSON, PNG, JPG).
    Saves file to assets/uploads, reads text, creates document,
    and runs AI entity extraction.
    """
    doc_id = f"DOC-{uuid.uuid4().hex[:6].upper()}"
    filename = file.filename or "uploaded_evidence.txt"
    title = title or filename.rsplit(".", 1)[0].replace("_", " ").title()

    file_bytes = await file.read()
    file_size = len(file_bytes)
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "txt"

    # Save to disk
    dest_path = UPLOAD_DIR / f"{doc_id}_{filename}"
    with open(dest_path, "wb") as f:
        f.write(file_bytes)

    # Extract text content if readable
    raw_text = ""
    if ext in ["txt", "json", "csv", "log", "md"]:
        try:
            raw_text = file_bytes.decode("utf-8", errors="replace")
        except Exception:
            raw_text = f"[Binary or encoded content of {filename}]"
    else:
        raw_text = f"[Evidence attachment {filename}: size {file_size} bytes, type {ext.upper()}]"

    extracted_entities = []
    summary = f"Uploaded file {filename} ({round(file_size/1024, 1)} KB)"

    if extract_entities and raw_text and len(raw_text.strip()) > 10:
        try:
            extraction = ai_service.extract_entities_and_relations(raw_text, title)
            extracted_entities = extraction.get("entities", [])
            summary = extraction.get("summary", summary)
        except Exception as e:
            print(f"[Upload Error extracting AI entities]: {e}")

    with get_db() as conn:
        conn.execute("""
            INSERT INTO documents (
                id, title, source_type, case_id, file_type, file_size,
                ocr_status, summary, entity_count, raw_text, uploaded_by, storage_ref
            ) VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?, 'AN-89241', ?)
        """, (
            doc_id, title, source_type, case_id, ext, file_size,
            summary, len(extracted_entities), raw_text[:5000], str(dest_path.name)
        ))

        if case_id:
            conn.execute("""
                UPDATE cases SET document_count = document_count + 1, updated_at = datetime('now') WHERE id = ?
            """, (case_id,))

    log_audit("AN-89241", "UPLOAD", "document", doc_id, case_id, details=f"Uploaded {filename}")

    return {
        "success": True,
        "document_id": doc_id,
        "filename": filename,
        "title": title,
        "file_size": file_size,
        "file_type": ext,
        "summary": summary,
        "entities_extracted": len(extracted_entities),
        "entities": extracted_entities,
        "storage_ref": f"/assets/uploads/{dest_path.name}",
        "message": f"Evidence {filename} uploaded & indexed successfully into {case_id}."
    }
