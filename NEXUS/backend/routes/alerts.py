"""Alerts management API routes."""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from backend.database import get_db, dict_row, log_audit

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class DispositionUpdate(BaseModel):
    disposition: str  # pending_review, confirmed, false_positive


@router.get("")
def list_alerts(
    severity: Optional[str] = None,
    disposition: Optional[str] = None,
    case_id: Optional[str] = None,
    alert_type: Optional[str] = None,
    limit: int = Query(default=50, le=100),
):
    """List all alerts with optional filters."""
    with get_db() as conn:
        query = "SELECT * FROM alerts WHERE 1=1"
        params = []

        if severity:
            query += " AND severity = ?"
            params.append(severity)
        if disposition:
            query += " AND disposition = ?"
            params.append(disposition)
        if case_id:
            query += " AND case_id = ?"
            params.append(case_id)
        if alert_type:
            query += " AND alert_type = ?"
            params.append(alert_type)

        query += """ ORDER BY
            CASE severity
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                ELSE 4
            END,
            created_at DESC
            LIMIT ?
        """
        params.append(limit)

        rows = conn.execute(query, params).fetchall()

    return {"alerts": [dict_row(r) for r in rows]}


@router.get("/stats")
def get_alert_stats():
    """Get alert statistics by severity and disposition."""
    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) FROM alerts").fetchone()[0]
        critical = conn.execute("SELECT COUNT(*) FROM alerts WHERE severity='critical'").fetchone()[0]
        high = conn.execute("SELECT COUNT(*) FROM alerts WHERE severity='high'").fetchone()[0]
        medium = conn.execute("SELECT COUNT(*) FROM alerts WHERE severity='medium'").fetchone()[0]
        low = conn.execute("SELECT COUNT(*) FROM alerts WHERE severity='low'").fetchone()[0]

        pending = conn.execute("SELECT COUNT(*) FROM alerts WHERE disposition='pending_review'").fetchone()[0]
        confirmed = conn.execute("SELECT COUNT(*) FROM alerts WHERE disposition='confirmed'").fetchone()[0]
        false_pos = conn.execute("SELECT COUNT(*) FROM alerts WHERE disposition='false_positive'").fetchone()[0]

    return {
        "total": total,
        "by_severity": {"critical": critical, "high": high, "medium": medium, "low": low},
        "by_disposition": {"pending_review": pending, "confirmed": confirmed, "false_positive": false_pos},
        "unread": pending,
    }


@router.get("/{alert_id}")
def get_alert(alert_id: str):
    """Get full alert detail with evidence."""
    with get_db() as conn:
        alert = conn.execute("SELECT * FROM alerts WHERE id = ?", (alert_id,)).fetchone()
        if not alert:
            return {"error": "Alert not found"}

        alert = dict_row(alert)

        # Get linked entities
        entity_ids = alert.get('linked_entity_ids', [])
        entities = []
        if isinstance(entity_ids, list):
            for eid in entity_ids:
                e = conn.execute("SELECT id, name, entity_type, risk_score FROM entities WHERE id = ?",
                                 (eid,)).fetchone()
                if e:
                    entities.append(dict_row(e))

        # Get evidence documents
        evidence_ids = alert.get('evidence_ids', [])
        documents = []
        if isinstance(evidence_ids, list):
            for did in evidence_ids:
                d = conn.execute("SELECT * FROM documents WHERE id = ?", (did,)).fetchone()
                if d:
                    documents.append(dict_row(d))

    log_audit("AN-89241", "VIEW", "alert", alert_id, alert.get('case_id'))
    return {"alert": alert, "linked_entities": entities, "evidence_documents": documents}


@router.put("/{alert_id}/disposition")
def update_disposition(alert_id: str, data: DispositionUpdate):
    """Update alert disposition."""
    valid = ['pending_review', 'confirmed', 'false_positive']
    if data.disposition not in valid:
        return {"error": f"Invalid disposition. Must be one of: {valid}"}

    with get_db() as conn:
        conn.execute("""
            UPDATE alerts SET disposition = ?, reviewed_by = 'AN-89241',
                              reviewed_at = datetime('now')
            WHERE id = ?
        """, (data.disposition, alert_id))

    log_audit("AN-89241", "UPDATE_DISPOSITION", "alert", alert_id,
              justification=f"Disposition set to {data.disposition}")
    return {"success": True, "message": f"Alert disposition updated to '{data.disposition}'."}
