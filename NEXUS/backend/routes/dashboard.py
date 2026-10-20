"""Dashboard API routes — KPI stats, recent activity, priority alerts."""

from fastapi import APIRouter
from backend.database import get_db, dict_row

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_dashboard_stats():
    """Return KPI card data for the dashboard."""
    with get_db() as conn:
        active_cases = conn.execute(
            "SELECT COUNT(*) FROM cases WHERE status IN ('open', 'investigating')"
        ).fetchone()[0]

        total_entities = conn.execute("SELECT COUNT(*) FROM entities").fetchone()[0]

        pending_review = conn.execute(
            "SELECT COUNT(*) FROM alerts WHERE disposition = 'pending_review'"
        ).fetchone()[0]

        open_alerts = conn.execute("SELECT COUNT(*) FROM alerts").fetchone()[0]

        critical_alerts = conn.execute(
            "SELECT COUNT(*) FROM alerts WHERE severity = 'critical'"
        ).fetchone()[0]

        high_alerts = conn.execute(
            "SELECT COUNT(*) FROM alerts WHERE severity = 'high'"
        ).fetchone()[0]

        total_documents = conn.execute("SELECT COUNT(*) FROM documents").fetchone()[0]

        total_relationships = conn.execute("SELECT COUNT(*) FROM relationships").fetchone()[0]

        # Average risk score
        avg_risk = conn.execute(
            "SELECT AVG(risk_score) FROM entities WHERE risk_score > 0"
        ).fetchone()[0] or 0

    return {
        "active_cases": active_cases,
        "total_entities": total_entities,
        "pending_review": pending_review,
        "open_alerts": open_alerts,
        "critical_alerts": critical_alerts,
        "high_alerts": high_alerts,
        "total_documents": total_documents,
        "total_relationships": total_relationships,
        "avg_risk_score": round(avg_risk, 1),
        "ingest_rate": "4,892 ev/min",
        "stream_status": "REALTIME FEDERATED",
        "last_sync": "00:01:14 UTC",
    }


@router.get("/recent-activity")
def get_recent_activity():
    """Return recent activity feed for the dashboard."""
    with get_db() as conn:
        audit_entries = conn.execute("""
            SELECT a.*, u.name as user_name
            FROM audit_log a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.timestamp DESC
            LIMIT 15
        """).fetchall()

        activities = []
        for entry in audit_entries:
            e = dict_row(entry)
            icon = _action_icon(e.get('action', ''))
            activities.append({
                "id": e['id'],
                "user": e.get('user_name', e.get('user_id', 'System')),
                "action": e.get('action', 'Unknown'),
                "resource_type": e.get('resource_type', ''),
                "resource_id": e.get('resource_id', ''),
                "case_id": e.get('case_id', ''),
                "details": e.get('details', ''),
                "timestamp": e.get('timestamp', ''),
                "icon": icon,
            })

        # Add some synthetic recent activities
        activities.extend([
            {"id": 100, "user": "System: Anomaly Engine", "action": "DETECT", "resource_type": "pattern",
             "resource_id": "ALT-8821", "case_id": "CS-2024-7720",
             "details": "Financial structuring pattern flagged — 32 sub-threshold transactions detected.",
             "timestamp": "2026-03-20T14:22:00Z", "icon": "warning"},
            {"id": 101, "user": "System: NER Pipeline", "action": "EXTRACT", "resource_type": "entity",
             "resource_id": "", "case_id": "CS-2024-8841",
             "details": "Extracted 12 entities from DOC-4471 (CDR Analysis Report). 10 auto-accepted, 2 queued for review.",
             "timestamp": "2026-03-20T13:45:00Z", "icon": "smart_toy"},
            {"id": 102, "user": "System: Graph Engine", "action": "UPDATE", "resource_type": "graph",
             "resource_id": "", "case_id": "CS-2024-8841",
             "details": "Graph updated: 3 new edges added between POI-9042 and financial entities.",
             "timestamp": "2026-03-20T13:30:00Z", "icon": "hub"},
        ])

    return {"activities": activities[:15]}


@router.get("/priority-alerts")
def get_priority_alerts():
    """Return top priority alerts for the dashboard."""
    with get_db() as conn:
        alerts = conn.execute("""
            SELECT * FROM alerts
            WHERE severity IN ('critical', 'high')
            ORDER BY
                CASE severity
                    WHEN 'critical' THEN 1
                    WHEN 'high' THEN 2
                    ELSE 3
                END,
                created_at DESC
            LIMIT 5
        """).fetchall()

    return {"alerts": [dict_row(a) for a in alerts]}


@router.get("/case-summary")
def get_case_summary():
    """Quick case summary for dashboard cards."""
    with get_db() as conn:
        cases = conn.execute("""
            SELECT id, title, status, priority, entity_count, alert_count
            FROM cases
            WHERE status != 'closed'
            ORDER BY
                CASE priority
                    WHEN 'critical' THEN 1
                    WHEN 'high' THEN 2
                    WHEN 'medium' THEN 3
                    ELSE 4
                END
            LIMIT 5
        """).fetchall()

    return {"cases": [dict_row(c) for c in cases]}


def _action_icon(action):
    icons = {
        "LOGIN": "login",
        "VIEW": "visibility",
        "RUN_ANALYSIS": "analytics",
        "UPLOAD": "upload_file",
        "DETECT": "warning",
        "EXTRACT": "smart_toy",
        "UPDATE": "edit",
        "CREATE": "add_circle",
        "DELETE": "delete",
        "EXPORT": "download",
    }
    return icons.get(action, "info")


@router.get("/entity-breakdown")
def get_entity_breakdown():
    """Entity type distribution for dashboard charts."""
    with get_db() as conn:
        rows = conn.execute("""
            SELECT entity_type, COUNT(*) as count,
                   ROUND(AVG(risk_score), 1) as avg_risk
            FROM entities
            GROUP BY entity_type
            ORDER BY count DESC
        """).fetchall()

    return {
        "breakdown": [
            {"type": dict(r)['entity_type'], "count": dict(r)['count'], "avg_risk": dict(r)['avg_risk']}
            for r in rows
        ]
    }


@router.get("/timeline")
def get_dashboard_timeline():
    """Activity timeline for dashboard — recent events across the system."""
    events = []
    with get_db() as conn:
        # Recent alerts
        alerts = conn.execute("""
            SELECT id, title, severity, alert_type, created_at, case_id
            FROM alerts ORDER BY created_at DESC LIMIT 10
        """).fetchall()
        for a in alerts:
            a = dict(a)
            events.append({
                "type": "alert",
                "id": a['id'],
                "title": a['title'],
                "severity": a['severity'],
                "timestamp": a['created_at'],
                "case_id": a.get('case_id'),
                "icon": "warning",
            })

        # Recent documents
        docs = conn.execute("""
            SELECT id, title, source_type, upload_date, case_id
            FROM documents ORDER BY upload_date DESC LIMIT 5
        """).fetchall()
        for d in docs:
            d = dict(d)
            events.append({
                "type": "document",
                "id": d['id'],
                "title": d['title'],
                "severity": "info",
                "timestamp": d['upload_date'],
                "case_id": d.get('case_id'),
                "icon": "description",
            })

        # Recent audit entries
        audit = conn.execute("""
            SELECT a.action, a.resource_type, a.resource_id, a.timestamp,
                   a.details, u.name as user_name
            FROM audit_log a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.timestamp DESC LIMIT 10
        """).fetchall()
        for entry in audit:
            entry = dict(entry)
            events.append({
                "type": "audit",
                "id": entry.get('resource_id', ''),
                "title": f"{entry.get('user_name', 'System')}: {entry['action']} {entry.get('resource_type', '')}",
                "severity": "info",
                "timestamp": entry['timestamp'],
                "icon": _action_icon(entry['action']),
            })

    events.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    return {"events": events[:20]}
