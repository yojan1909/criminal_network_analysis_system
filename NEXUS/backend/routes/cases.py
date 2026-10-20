"""Case management API routes."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from backend.database import get_db, dict_row, log_audit
import json
from datetime import datetime

router = APIRouter(prefix="/api/cases", tags=["cases"])


class CaseCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    assigned_officers: List[str] = []


class CaseStatusUpdate(BaseModel):
    status: str


class NoteCreate(BaseModel):
    content: str
    note_type: str = "general"


class EntityLink(BaseModel):
    entity_id: str


@router.get("")
def list_cases(status: Optional[str] = None, priority: Optional[str] = None):
    """List all cases with optional filters."""
    with get_db() as conn:
        query = "SELECT * FROM cases WHERE 1=1"
        params = []

        if status:
            query += " AND status = ?"
            params.append(status)
        if priority:
            query += " AND priority = ?"
            params.append(priority)

        query += """ ORDER BY
            CASE priority
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                ELSE 4
            END,
            updated_at DESC
        """

        rows = conn.execute(query, params).fetchall()

    return {"cases": [dict_row(r) for r in rows]}


@router.get("/{case_id}")
def get_case(case_id: str):
    """Get full case detail."""
    with get_db() as conn:
        case = conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            return {"error": "Case not found"}

        case = dict_row(case)

        # Get linked entities
        entities = conn.execute("""
            SELECT * FROM entities WHERE case_id = ? ORDER BY risk_score DESC
        """, (case_id,)).fetchall()

        # Get documents
        documents = conn.execute("""
            SELECT * FROM documents WHERE case_id = ? ORDER BY upload_date DESC
        """, (case_id,)).fetchall()

        # Get alerts
        alerts = conn.execute("""
            SELECT * FROM alerts WHERE case_id = ? ORDER BY
                CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2
                WHEN 'medium' THEN 3 ELSE 4 END
        """, (case_id,)).fetchall()

        # Get notes
        notes = conn.execute("""
            SELECT * FROM notes WHERE case_id = ? ORDER BY created_at DESC
        """, (case_id,)).fetchall()

        # Get insights
        insights = conn.execute("""
            SELECT * FROM insights WHERE case_id = ?
        """, (case_id,)).fetchall()

        # Get assigned officers
        officer_ids = case.get('assigned_officers', [])
        officers = []
        if isinstance(officer_ids, list):
            for oid in officer_ids:
                officer = conn.execute("SELECT * FROM users WHERE id = ?", (oid,)).fetchone()
                if officer:
                    officers.append(dict_row(officer))

    log_audit("AN-89241", "VIEW", "case", case_id, case_id)

    return {
        "case": case,
        "entities": [dict_row(e) for e in entities],
        "documents": [dict_row(d) for d in documents],
        "alerts": [dict_row(a) for a in alerts],
        "notes": [dict_row(n) for n in notes],
        "insights": [dict_row(i) for i in insights],
        "officers": officers,
    }


@router.post("")
def create_case(data: CaseCreate):
    """Create a new case."""
    import uuid
    case_id = f"CS-{datetime.now().strftime('%Y')}-{random_digits(4)}"

    with get_db() as conn:
        conn.execute("""
            INSERT INTO cases (id, title, description, priority, assigned_officers, created_by)
            VALUES (?, ?, ?, ?, ?, 'AN-89241')
        """, (case_id, data.title, data.description, data.priority,
              json.dumps(data.assigned_officers)))

    log_audit("AN-89241", "CREATE", "case", case_id, case_id, "New case creation")
    return {"success": True, "case_id": case_id, "message": f"Case {case_id} created."}


@router.put("/{case_id}/status")
def update_case_status(case_id: str, data: CaseStatusUpdate):
    """Update case status (workflow transition)."""
    valid_transitions = {
        "open": ["investigating"],
        "investigating": ["chargesheet_ready", "open"],
        "chargesheet_ready": ["closed", "investigating"],
        "closed": ["open"],
    }

    with get_db() as conn:
        case = conn.execute("SELECT status FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            return {"error": "Case not found"}

        current = case['status']
        if data.status not in valid_transitions.get(current, []):
            return {"error": f"Invalid transition from '{current}' to '{data.status}'"}

        conn.execute("""
            UPDATE cases SET status = ?, updated_at = datetime('now') WHERE id = ?
        """, (data.status, case_id))

    log_audit("AN-89241", "UPDATE_STATUS", "case", case_id, case_id,
              f"Status: {current} → {data.status}")
    return {"success": True, "message": f"Case status updated to '{data.status}'."}


@router.post("/{case_id}/notes")
def add_case_note(case_id: str, data: NoteCreate):
    """Add a note to a case."""
    with get_db() as conn:
        conn.execute("""
            INSERT INTO notes (case_id, content, author_id, author_name, note_type)
            VALUES (?, ?, 'AN-89241', 'Analyst M. Vance', ?)
        """, (case_id, data.content, data.note_type))

        conn.execute("UPDATE cases SET updated_at = datetime('now') WHERE id = ?", (case_id,))

    log_audit("AN-89241", "ADD_NOTE", "case", case_id, case_id, details=data.content[:60])
    return {"success": True, "message": "Note added to case chain of custody."}


@router.post("/{case_id}/entities")
def link_entity_to_case(case_id: str, data: EntityLink):
    """Link an entity to a case."""
    with get_db() as conn:
        conn.execute("""
            UPDATE entities SET case_id = ? WHERE id = ?
        """, (case_id, data.entity_id))

        # Update entity count
        ec = conn.execute("SELECT COUNT(*) FROM entities WHERE case_id=?", (case_id,)).fetchone()[0]
        conn.execute("UPDATE cases SET entity_count=?, updated_at=datetime('now') WHERE id=?",
                     (ec, case_id))

    log_audit("AN-89241", "LINK_ENTITY", "case", case_id, case_id)
    return {"success": True, "message": f"Entity {data.entity_id} linked to case {case_id}."}


class AssignOfficerRequest(BaseModel):
    officer_id: str = "AN-89241"
    officer_name: Optional[str] = "Analyst M. Vance"


@router.post("/{case_id}/assign-officer")
def assign_officer_to_case(case_id: str, data: AssignOfficerRequest):
    """Assign an investigating officer to a case."""
    with get_db() as conn:
        case = conn.execute("SELECT assigned_officers FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            return {"error": "Case not found"}, 404

        officers = []
        raw = case["assigned_officers"]
        if raw:
            try:
                officers = json.loads(raw) if isinstance(raw, str) else list(raw)
            except Exception:
                officers = [raw]

        if data.officer_id not in officers:
            officers.append(data.officer_id)

        conn.execute("""
            UPDATE cases SET assigned_officers = ?, updated_at = datetime('now') WHERE id = ?
        """, (json.dumps(officers), case_id))

    log_audit("AN-89241", "ASSIGN_OFFICER", "case", case_id, case_id, f"Assigned {data.officer_name or data.officer_id}")
    return {"success": True, "message": f"Officer {data.officer_name or data.officer_id} assigned to case {case_id}."}


class PinEntityRequest(BaseModel):
    entity_id: str
    pinned: bool = True


@router.post("/{case_id}/pin-entity")
def pin_entity_to_case(case_id: str, data: PinEntityRequest):
    """Pin or unpin a dossier / entity in the case workspace."""
    with get_db() as conn:
        # Check if entity exists
        ent = conn.execute("SELECT id, name FROM entities WHERE id = ?", (data.entity_id,)).fetchone()
        if not ent:
            return {"error": "Entity not found"}, 404

        action_desc = f"{'Pinned' if data.pinned else 'Unpinned'} entity {ent['name']} ({data.entity_id})"
        log_audit("AN-89241", "PIN_ENTITY" if data.pinned else "UNPIN_ENTITY", "case", case_id, case_id, action_desc)

    return {"success": True, "pinned": data.pinned, "entity_id": data.entity_id, "case_id": case_id, "message": action_desc}


class LinkEvidenceRequest(BaseModel):
    document_id: Optional[str] = None
    entity_id: Optional[str] = None
    description: Optional[str] = ""


@router.post("/{case_id}/link-evidence")
def link_evidence_to_case(case_id: str, data: LinkEvidenceRequest):
    """Link an existing document or evidence piece to the case."""
    with get_db() as conn:
        if data.document_id:
            conn.execute("UPDATE documents SET case_id = ? WHERE id = ?", (case_id, data.document_id))
            doc_cnt = conn.execute("SELECT COUNT(*) FROM documents WHERE case_id = ?", (case_id,)).fetchone()[0]
            conn.execute("UPDATE cases SET document_count = ?, updated_at = datetime('now') WHERE id = ?", (doc_cnt, case_id))

        if data.entity_id:
            conn.execute("UPDATE entities SET case_id = ? WHERE id = ?", (case_id, data.entity_id))
            ent_cnt = conn.execute("SELECT COUNT(*) FROM entities WHERE case_id = ?", (case_id,)).fetchone()[0]
            conn.execute("UPDATE cases SET entity_count = ?, updated_at = datetime('now') WHERE id = ?", (ent_cnt, case_id))

    log_audit("AN-89241", "LINK_EVIDENCE", "case", case_id, case_id, f"Linked evidence doc={data.document_id} ent={data.entity_id}")
    return {"success": True, "message": "Evidence successfully linked to case file."}


def random_digits(n):
    import random
    return ''.join([str(random.randint(0, 9)) for _ in range(n)])
