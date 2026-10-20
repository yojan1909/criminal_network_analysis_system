"""Audit log API routes."""

from fastapi import APIRouter, Query
from typing import Optional
from backend.database import get_db, dict_row

router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.get("/log")
def get_audit_log(
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    case_id: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
):
    """Query audit log entries (read-only)."""
    with get_db() as conn:
        query = """
            SELECT a.*, u.name as user_name
            FROM audit_log a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE 1=1
        """
        params = []

        if user_id:
            query += " AND a.user_id = ?"
            params.append(user_id)
        if action:
            query += " AND a.action = ?"
            params.append(action)
        if resource_type:
            query += " AND a.resource_type = ?"
            params.append(resource_type)
        if case_id:
            query += " AND a.case_id = ?"
            params.append(case_id)

        count_q = query.replace("SELECT a.*, u.name as user_name", "SELECT COUNT(*)")
        count_q = count_q.replace("LEFT JOIN users u ON a.user_id = u.id", "")
        total = conn.execute(count_q, params).fetchone()[0]

        query += " ORDER BY a.timestamp DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        rows = conn.execute(query, params).fetchall()

    return {
        "entries": [dict_row(r) for r in rows],
        "total": total,
        "limit": limit,
        "offset": offset,
    }
