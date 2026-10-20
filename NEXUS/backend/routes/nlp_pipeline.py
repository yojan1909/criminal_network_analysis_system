"""
Nexus Intelligence Command Center — NLP Pipeline & Review Queue Routes
Provides text entity extraction, document ingestion, and human-in-the-loop review.
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.database import get_db, dict_row, log_audit
from backend.ai_service import ai_service
from backend.config import config
from backend.graph import get_graph
import uuid
import json

router = APIRouter(prefix="/api/nlp", tags=["nlp-pipeline"])


class ExtractRequest(BaseModel):
    text: str
    document_title: Optional[str] = "Investigative Note"
    case_id: Optional[str] = None


class IngestDocumentRequest(BaseModel):
    title: str
    source_type: str = "FIR"  # FIR, surveillance, witness_statement, interrogation, intelligence_brief
    case_id: Optional[str] = None
    text: str
    auto_commit: bool = True  # If true, auto-accept high confidence entities into graph


class ReviewActionRequest(BaseModel):
    edited_name: Optional[str] = None
    edited_type: Optional[str] = None


@router.post("/extract")
def extract_from_text(data: ExtractRequest):
    """
    Extract entities and relationships from raw text using AI model or heuristic pipeline.
    """
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    result = ai_service.extract_entities_and_relations(data.text, data.document_title)
    log_audit("AN-89241", "NLP_EXTRACT", "text", details=f"Extracted from '{data.document_title}'")
    return result


@router.post("/ingest")
def ingest_document(data: IngestDocumentRequest):
    """
    Ingest a new investigative document:
    1. Saves document record to database.
    2. Runs NLP NER and relationship extraction.
    3. Auto-accepts entities with confidence >= threshold into graph.
    4. Queues remaining extractions in the Human-in-the-Loop review queue.
    """
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Document text cannot be empty.")

    doc_id = f"DOC-{uuid.uuid4().hex[:6].upper()}"
    threshold = config.AUTO_ACCEPT_THRESHOLD

    # Run extraction
    extraction = ai_service.extract_entities_and_relations(data.text, data.title)
    extracted_entities = extraction.get("entities", [])
    extracted_rels = extraction.get("relationships", [])

    auto_accepted_entities = []
    queued_entities = []

    with get_db() as conn:
        # 1. Insert document
        conn.execute("""
            INSERT INTO documents (
                id, title, source_type, case_id, file_type, file_size,
                ocr_status, summary, entity_count, raw_text, uploaded_by
            ) VALUES (?, ?, ?, ?, 'text', ?, 'completed', ?, ?, ?, 'AN-89241')
        """, (
            doc_id, data.title, data.source_type, data.case_id,
            len(data.text.encode('utf-8')),
            extraction.get("summary", f"Extracted {len(extracted_entities)} entities"),
            len(extracted_entities), data.text
        ))

        # 2. Process extracted entities
        for ent in extracted_entities:
            conf = float(ent.get("confidence", 0.75))
            name = ent.get("name", "").strip()
            etype = ent.get("entity_type", "Person")
            attrs = ent.get("attributes", {})

            if data.auto_commit and conf >= threshold:
                # Auto-accept into active entities table
                eid = f"POI-{uuid.uuid4().hex[:4].upper()}" if etype == "Person" else f"ENT-{uuid.uuid4().hex[:4].upper()}"

                phone = attrs.get("number") if etype == "PhoneNumber" else None
                veh = attrs.get("registration_no") if etype == "Vehicle" else None
                acc = attrs.get("account_number") if etype == "BankAccount" else None

                conn.execute("""
                    INSERT INTO entities (
                        id, entity_type, name, description, confidence, case_id,
                        phone_number, vehicle_reg, account_number, created_by
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'system:nlp_auto_accept')
                """, (
                    eid, etype, name, f"Auto-extracted from {doc_id} ({data.title})",
                    conf, data.case_id, phone, veh, acc
                ))
                auto_accepted_entities.append({"id": eid, "name": name, "type": etype, "confidence": conf})
            else:
                # Route to human review queue
                conn.execute("""
                    INSERT INTO extraction_queue (
                        document_id, case_id, entity_type, name, confidence,
                        text_span, extracted_attributes, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                """, (
                    doc_id, data.case_id, etype, name, conf,
                    ent.get("text_span", ""), json.dumps(attrs)
                ))
                queued_entities.append({"name": name, "type": etype, "confidence": conf})

        # 3. Update case document count if case_id present
        if data.case_id:
            conn.execute("""
                UPDATE cases
                SET document_count = document_count + 1,
                    updated_at = datetime('now')
                WHERE id = ?
            """, (data.case_id,))

    # Invalidate in-memory graph cache if entities were added
    if auto_accepted_entities:
        get_graph(force_rebuild=True)

    log_audit("AN-89241", "DOCUMENT_INGEST", "document", doc_id, data.case_id,
              details=f"Ingested {doc_id}. Auto-accepted: {len(auto_accepted_entities)}, Queued: {len(queued_entities)}")

    return {
        "success": True,
        "document_id": doc_id,
        "title": data.title,
        "total_extracted": len(extracted_entities),
        "auto_accepted_count": len(auto_accepted_entities),
        "auto_accepted_entities": auto_accepted_entities,
        "queued_for_review_count": len(queued_entities),
        "queued_entities": queued_entities,
        "relationships_detected": extracted_rels,
        "summary": extraction.get("summary"),
        "model_used": extraction.get("model_used"),
    }


@router.get("/review-queue")
def get_review_queue(case_id: Optional[str] = None, status: str = "pending"):
    """
    List items in the Human-in-the-Loop review queue.
    """
    with get_db() as conn:
        q = """
            SELECT q.*, d.title as document_title, d.source_type as document_type
            FROM extraction_queue q
            LEFT JOIN documents d ON q.document_id = d.id
            WHERE q.status = ?
        """
        params = [status]
        if case_id:
            q += " AND q.case_id = ?"
            params.append(case_id)
        q += " ORDER BY q.created_at DESC"

        rows = conn.execute(q, params).fetchall()

    return {
        "status": status,
        "count": len(rows),
        "items": [dict_row(r) for r in rows]
    }


@router.post("/review-queue/{queue_id}/approve")
def approve_queued_extraction(queue_id: int, data: Optional[ReviewActionRequest] = None):
    """
    Investigator reviews and confirms a queued entity extraction,
    promoting it to the live graph.
    """
    with get_db() as conn:
        row = conn.execute("SELECT * FROM extraction_queue WHERE id = ?", (queue_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Queue item not found.")

        item = dict(row)
        if item["status"] != "pending":
            raise HTTPException(status_code=400, detail=f"Item is already {item['status']}.")

        name = data.edited_name if (data and data.edited_name) else item["name"]
        etype = data.edited_type if (data and data.edited_type) else item["entity_type"]

        eid = f"POI-{uuid.uuid4().hex[:4].upper()}" if etype == "Person" else f"ENT-{uuid.uuid4().hex[:4].upper()}"

        # Insert into entities
        conn.execute("""
            INSERT INTO entities (
                id, entity_type, name, description, confidence, case_id, created_by
            ) VALUES (?, ?, ?, ?, 1.0, ?, 'analyst:verified')
        """, (
            eid, etype, name,
            f"Verified from document {item['document_id']}",
            item["case_id"]
        ))

        # Mark as approved in queue
        conn.execute("""
            UPDATE extraction_queue
            SET status = 'approved', reviewed_by = 'AN-89241', reviewed_at = datetime('now')
            WHERE id = ?
        """, (queue_id,))

    # Invalidate graph
    get_graph(force_rebuild=True)

    log_audit("AN-89241", "APPROVE_EXTRACTION", "entity", eid, item.get("case_id"),
              details=f"Approved queued entity '{name}' ({etype}) into graph.")

    return {
        "success": True,
        "message": f"Entity '{name}' approved and committed to the graph as {eid}.",
        "entity_id": eid,
    }


@router.post("/review-queue/{queue_id}/reject")
def reject_queued_extraction(queue_id: int):
    """
    Investigator rejects a false-positive extraction.
    """
    with get_db() as conn:
        row = conn.execute("SELECT * FROM extraction_queue WHERE id = ?", (queue_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Queue item not found.")

        conn.execute("""
            UPDATE extraction_queue
            SET status = 'rejected', reviewed_by = 'AN-89241', reviewed_at = datetime('now')
            WHERE id = ?
        """, (queue_id,))

    log_audit("AN-89241", "REJECT_EXTRACTION", "extraction_queue", str(queue_id),
              details=f"Rejected queued extraction '{row['name']}' ({row['entity_type']}).")

    return {"success": True, "message": "Extraction rejected successfully."}
