"""Entity API routes — CRUD, profiles, relationships, timeline."""

from fastapi import APIRouter, Query
from typing import Optional
from backend.database import get_db, dict_row, log_audit
import json

from pydantic import BaseModel
import uuid
from backend.graph import get_graph

router = APIRouter(prefix="/api/entities", tags=["entities"])


class EntityCreate(BaseModel):
    entity_type: str = "Person"
    name: str
    aliases: Optional[list] = []
    description: Optional[str] = ""
    risk_score: Optional[float] = 50.0
    case_id: Optional[str] = None
    phone_number: Optional[str] = None
    vehicle_reg: Optional[str] = None
    account_number: Optional[str] = None


@router.post("")
def create_entity(data: EntityCreate):
    """Create a new entity record."""
    eid = f"POI-{uuid.uuid4().hex[:4].upper()}" if data.entity_type == "Person" else f"ENT-{uuid.uuid4().hex[:4].upper()}"

    with get_db() as conn:
        conn.execute("""
            INSERT INTO entities (
                id, entity_type, name, aliases, description, risk_score,
                confidence, case_id, phone_number, vehicle_reg, account_number,
                created_by
            ) VALUES (?, ?, ?, ?, ?, ?, 1.0, ?, ?, ?, ?, 'investigating_officer')
        """, (
            eid, data.entity_type, data.name, json.dumps(data.aliases or []),
            data.description, data.risk_score or 50.0, data.case_id,
            data.phone_number, data.vehicle_reg, data.account_number
        ))

        if data.case_id:
            conn.execute("""
                UPDATE cases SET entity_count = entity_count + 1, updated_at = datetime('now')
                WHERE id = ?
            """, (data.case_id,))

    # Invalidate graph
    get_graph(force_rebuild=True)

    log_audit("AN-89241", "CREATE", "entity", eid, data.case_id, details=f"Created {data.entity_type}: {data.name}")
    return {"success": True, "entity_id": eid, "message": f"Entity {data.name} ({eid}) created successfully."}


@router.get("")
def list_entities(
    entity_type: Optional[str] = None,
    case_id: Optional[str] = None,
    q: Optional[str] = None,
    risk_min: Optional[float] = None,
    status: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
):
    """List/search entities with filters."""
    with get_db() as conn:
        query = "SELECT * FROM entities WHERE 1=1"
        params = []

        if entity_type:
            query += " AND entity_type = ?"
            params.append(entity_type)
        if case_id:
            query += " AND case_id = ?"
            params.append(case_id)
        if q:
            query += " AND (name LIKE ? OR aliases LIKE ? OR id LIKE ? OR description LIKE ?)"
            qp = f"%{q}%"
            params.extend([qp, qp, qp, qp])
        if risk_min is not None:
            query += " AND risk_score >= ?"
            params.append(risk_min)
        if status:
            query += " AND status = ?"
            params.append(status)

        # Count total
        count_query = query.replace("SELECT *", "SELECT COUNT(*)")
        total = conn.execute(count_query, params).fetchone()[0]

        query += " ORDER BY risk_score DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        rows = conn.execute(query, params).fetchall()

    return {
        "entities": [dict_row(r) for r in rows],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/{entity_id}")
def get_entity(entity_id: str):
    """Get full entity profile."""
    with get_db() as conn:
        entity = conn.execute("SELECT * FROM entities WHERE id = ?", (entity_id,)).fetchone()
        if not entity:
            return {"error": "Entity not found"}, 404

        entity = dict_row(entity)

        # Get relationships
        rels = conn.execute("""
            SELECT r.*, e.name as target_name, e.entity_type as target_type, e.risk_score as target_risk
            FROM relationships r
            JOIN entities e ON (r.target_entity_id = e.id)
            WHERE r.source_entity_id = ?
            UNION ALL
            SELECT r.*, e.name as target_name, e.entity_type as target_type, e.risk_score as target_risk
            FROM relationships r
            JOIN entities e ON (r.source_entity_id = e.id)
            WHERE r.target_entity_id = ?
        """, (entity_id, entity_id)).fetchall()

        # Get documents that mention this entity
        docs = conn.execute("""
            SELECT d.* FROM documents d
            WHERE d.case_id = (SELECT case_id FROM entities WHERE id = ?)
        """, (entity_id,)).fetchall()

        # Get notes for this entity
        notes = conn.execute("""
            SELECT * FROM notes WHERE entity_id = ? ORDER BY created_at DESC
        """, (entity_id,)).fetchall()

        # Get communications
        comms = conn.execute("""
            SELECT * FROM communications
            WHERE source_entity_id = ? OR target_entity_id = ?
            ORDER BY timestamp DESC LIMIT 50
        """, (entity_id, entity_id)).fetchall()

        # Get transactions
        txns = conn.execute("""
            SELECT * FROM transactions
            WHERE source_entity_id = ? OR target_entity_id = ?
            ORDER BY timestamp DESC LIMIT 50
        """, (entity_id, entity_id)).fetchall()

        # Get insights
        insights = conn.execute("""
            SELECT * FROM insights WHERE entity_id = ?
        """, (entity_id,)).fetchall()

        # Get case info
        case = None
        if entity.get('case_id'):
            case_row = conn.execute("SELECT * FROM cases WHERE id = ?",
                                     (entity['case_id'],)).fetchone()
            if case_row:
                case = dict_row(case_row)

    log_audit("AN-89241", "VIEW", "entity", entity_id, entity.get('case_id'))

    return {
        "entity": entity,
        "relationships": [dict_row(r) for r in rels],
        "documents": [dict_row(d) for d in docs],
        "notes": [dict_row(n) for n in notes],
        "communications": [dict(c) for c in comms],
        "transactions": [dict(t) for t in txns],
        "insights": [dict_row(i) for i in insights],
        "case": case,
    }


@router.get("/{entity_id}/relationships")
def get_entity_relationships(entity_id: str):
    """Get all relationships for an entity."""
    with get_db() as conn:
        rels = conn.execute("""
            SELECT r.*, 
                   es.name as source_name, es.entity_type as source_type,
                   et.name as target_name, et.entity_type as target_type
            FROM relationships r
            JOIN entities es ON r.source_entity_id = es.id
            JOIN entities et ON r.target_entity_id = et.id
            WHERE r.source_entity_id = ? OR r.target_entity_id = ?
            ORDER BY r.confidence DESC
        """, (entity_id, entity_id)).fetchall()

    return {"relationships": [dict_row(r) for r in rels]}


@router.get("/{entity_id}/timeline")
def get_entity_timeline(entity_id: str):
    """Get chronological timeline for an entity."""
    events = []

    with get_db() as conn:
        # Communications as events
        comms = conn.execute("""
            SELECT 'communication' as event_type, timestamp,
                   CASE WHEN source_entity_id = ? THEN 'Outgoing call to ' || target_number
                        ELSE 'Incoming call from ' || source_number END as description,
                   duration_seconds, flagged, flag_reason
            FROM communications
            WHERE source_entity_id = ? OR target_entity_id = ?
            ORDER BY timestamp
        """, (entity_id, entity_id, entity_id)).fetchall()

        for c in comms:
            c = dict(c)
            events.append({
                "type": "communication",
                "timestamp": c['timestamp'],
                "description": c['description'],
                "details": f"Duration: {c['duration_seconds']}s",
                "flagged": bool(c['flagged']),
                "flag_reason": c.get('flag_reason'),
            })

        # Transactions as events
        txns = conn.execute("""
            SELECT 'transaction' as event_type, timestamp,
                   CASE WHEN source_entity_id = ? THEN 'Outgoing transfer: ' || amount || ' ' || currency
                        ELSE 'Incoming transfer: ' || amount || ' ' || currency END as description,
                   amount, currency, mode, flagged, flag_reason
            FROM transactions
            WHERE source_entity_id = ? OR target_entity_id = ?
            ORDER BY timestamp
        """, (entity_id, entity_id, entity_id)).fetchall()

        for t in txns:
            t = dict(t)
            events.append({
                "type": "transaction",
                "timestamp": t['timestamp'],
                "description": t['description'],
                "details": f"Mode: {t['mode']}",
                "flagged": bool(t['flagged']),
                "flag_reason": t.get('flag_reason'),
            })

        # Notes as events
        notes = conn.execute("""
            SELECT 'note' as event_type, created_at as timestamp,
                   content as description, author_name, note_type
            FROM notes
            WHERE entity_id = ?
        """, (entity_id,)).fetchall()

        for n in notes:
            n = dict(n)
            events.append({
                "type": "note",
                "timestamp": n['timestamp'],
                "description": n['description'],
                "details": f"By: {n.get('author_name', 'Unknown')}",
                "flagged": False,
            })

    events.sort(key=lambda x: x['timestamp'])
    return {"entity_id": entity_id, "events": events}


@router.post("/{entity_id}/notes")
def add_entity_note(entity_id: str, content: str = "", note_type: str = "general"):
    """Add a note to an entity."""
    with get_db() as conn:
        entity = conn.execute("SELECT case_id FROM entities WHERE id = ?", (entity_id,)).fetchone()
        if not entity:
            return {"error": "Entity not found"}

        conn.execute("""
            INSERT INTO notes (entity_id, case_id, content, author_id, author_name, note_type)
            VALUES (?, ?, ?, 'AN-89241', 'Analyst M. Vance', ?)
        """, (entity_id, entity['case_id'], content, note_type))

    log_audit("AN-89241", "ADD_NOTE", "entity", entity_id)
    return {"success": True, "message": "Note added successfully."}


@router.get("/{entity_id}/financials")
def get_entity_financials(entity_id: str):
    """Get financial summary for an entity — transactions, totals, flagged patterns."""
    with get_db() as conn:
        # All transactions involving this entity
        txns = conn.execute("""
            SELECT t.*, es.name as source_name, et.name as target_name
            FROM transactions t
            LEFT JOIN entities es ON t.source_entity_id = es.id
            LEFT JOIN entities et ON t.target_entity_id = et.id
            WHERE t.source_entity_id = ? OR t.target_entity_id = ?
            ORDER BY t.timestamp DESC
        """, (entity_id, entity_id)).fetchall()

        txn_list = [dict(t) for t in txns]
        total_in = sum(t['amount'] for t in txn_list if t.get('target_entity_id') == entity_id)
        total_out = sum(t['amount'] for t in txn_list if t.get('source_entity_id') == entity_id)
        flagged = [t for t in txn_list if t.get('flagged')]
        patterns = list(set(t.get('flagged_pattern', '') for t in flagged if t.get('flagged_pattern')))

        # Monthly aggregation for charts
        monthly = {}
        for t in txn_list:
            month = t['timestamp'][:7] if t.get('timestamp') else 'Unknown'
            if month not in monthly:
                monthly[month] = {'inflow': 0, 'outflow': 0, 'count': 0}
            if t.get('target_entity_id') == entity_id:
                monthly[month]['inflow'] += t['amount']
            else:
                monthly[month]['outflow'] += t['amount']
            monthly[month]['count'] += 1

    return {
        "entity_id": entity_id,
        "total_transactions": len(txn_list),
        "total_inflow": round(total_in, 2),
        "total_outflow": round(total_out, 2),
        "net_flow": round(total_in - total_out, 2),
        "flagged_count": len(flagged),
        "flagged_patterns": patterns,
        "monthly_breakdown": [
            {"month": k, **v} for k, v in sorted(monthly.items())
        ],
        "transactions": txn_list[:50],
    }


@router.get("/{entity_id}/communications")
def get_entity_communications(entity_id: str):
    """Get CDR summary for an entity — call records, burst detection, top contacts."""
    with get_db() as conn:
        comms = conn.execute("""
            SELECT c.*, es.name as source_name, et.name as target_name
            FROM communications c
            LEFT JOIN entities es ON c.source_entity_id = es.id
            LEFT JOIN entities et ON c.target_entity_id = et.id
            WHERE c.source_entity_id = ? OR c.target_entity_id = ?
            ORDER BY c.timestamp DESC
        """, (entity_id, entity_id)).fetchall()

        comm_list = [dict(c) for c in comms]
        total_duration = sum(c.get('duration_seconds', 0) for c in comm_list)
        flagged = [c for c in comm_list if c.get('flagged')]

        # Top contacts by frequency
        contact_freq = {}
        for c in comm_list:
            other = c['target_entity_id'] if c.get('source_entity_id') == entity_id else c.get('source_entity_id')
            other_name = c.get('target_name') if c.get('source_entity_id') == entity_id else c.get('source_name')
            if other:
                if other not in contact_freq:
                    contact_freq[other] = {'id': other, 'name': other_name or other, 'count': 0, 'total_duration': 0}
                contact_freq[other]['count'] += 1
                contact_freq[other]['total_duration'] += c.get('duration_seconds', 0)

        top_contacts = sorted(contact_freq.values(), key=lambda x: x['count'], reverse=True)[:10]

        # Daily volume for burst detection chart
        daily_volume = {}
        for c in comm_list:
            day = c['timestamp'][:10] if c.get('timestamp') else 'Unknown'
            daily_volume[day] = daily_volume.get(day, 0) + 1

    return {
        "entity_id": entity_id,
        "total_records": len(comm_list),
        "total_duration_seconds": total_duration,
        "flagged_count": len(flagged),
        "top_contacts": top_contacts,
        "daily_volume": [{"date": k, "count": v} for k, v in sorted(daily_volume.items())],
        "records": comm_list[:100],
    }


class WiretapRequest(BaseModel):
    warrant_ref: Optional[str] = "WARRANT-FISA-2024-912"
    reason: Optional[str] = "High-confidence association with transnational smuggling hub"
    classification: Optional[str] = "TOP SECRET // NOFORN"


@router.post("/{entity_id}/wiretap")
def flag_entity_for_wiretap(entity_id: str, data: Optional[WiretapRequest] = None):
    """Submit entity for judicial wiretap review / SIGINT intercept order."""
    if data is None:
        data = WiretapRequest()
    with get_db() as conn:
        ent = conn.execute("SELECT id, name, case_id, phone_number FROM entities WHERE id = ?", (entity_id,)).fetchone()
        if not ent:
            return {"error": "Entity not found"}, 404

        alert_id = f"ALT-{uuid.uuid4().hex[:4].upper()}"
        phone = ent['phone_number'] or "Intercept Target Assets"
        conn.execute("""
            INSERT INTO alerts (id, title, alert_type, severity, description, case_id, linked_entity_ids, disposition, generated_by)
            VALUES (?, ?, 'sigint_wiretap', 'critical', ?, ?, ?, 'investigating', 'sigint_surveillance_pipeline')
        """, (
            alert_id,
            f"WIRETAP INTERCEPT ACTIVE: {ent['name']} ({phone})",
            f"Judicial intercept authorized under {data.warrant_ref}. Reason: {data.reason}. Classification: {data.classification}",
            ent['case_id'],
            json.dumps([entity_id])
        ))

    log_audit("AN-89241", "WIRETAP_ORDER", "entity", entity_id, ent['case_id'], f"Warrant: {data.warrant_ref}")
    return {
        "success": True,
        "alert_id": alert_id,
        "entity_id": entity_id,
        "name": ent['name'],
        "warrant_ref": data.warrant_ref,
        "message": f"Wiretap review flagged and intercept alert {alert_id} deployed."
    }


class SurveillanceRequest(BaseModel):
    location: Optional[str] = "Port of Limassol, Sector 4"
    observed_activity: str = "Target observed in physical rendezvous with co-conspirators"
    officer: Optional[str] = "Lead Vance"


@router.post("/{entity_id}/surveillance")
def add_entity_surveillance(entity_id: str, data: SurveillanceRequest):
    """Add a target surveillance observation to the entity's live record."""
    with get_db() as conn:
        ent = conn.execute("SELECT id, name, case_id FROM entities WHERE id = ?", (entity_id,)).fetchone()
        if not ent:
            return {"error": "Entity not found"}, 404

        conn.execute("""
            INSERT INTO notes (entity_id, case_id, content, author_id, author_name, note_type)
            VALUES (?, ?, ?, 'AN-89241', ?, 'surveillance')
        """, (
            entity_id,
            ent['case_id'],
            f"[SURVEILLANCE LOG @ {data.location}] {data.observed_activity}",
            data.officer or 'Analyst M. Vance'
        ))

    log_audit("AN-89241", "SURVEILLANCE_LOG", "entity", entity_id, ent['case_id'], data.observed_activity[:60])
    return {
        "success": True,
        "message": f"Surveillance entry recorded for {ent['name']}."
    }


class LinkCaseRequest(BaseModel):
    case_id: str = "CS-2024-8841"


@router.post("/{entity_id}/link-case")
def link_entity_to_case_endpoint(entity_id: str, data: LinkCaseRequest):
    """Link entity to a specific case file."""
    with get_db() as conn:
        ent = conn.execute("SELECT id, name FROM entities WHERE id = ?", (entity_id,)).fetchone()
        if not ent:
            return {"error": "Entity not found"}, 404

        conn.execute("UPDATE entities SET case_id = ? WHERE id = ?", (data.case_id, entity_id))
        cnt = conn.execute("SELECT COUNT(*) FROM entities WHERE case_id = ?", (data.case_id,)).fetchone()[0]
        conn.execute("UPDATE cases SET entity_count = ?, updated_at = datetime('now') WHERE id = ?", (cnt, data.case_id))

    log_audit("AN-89241", "LINK_CASE", "entity", entity_id, data.case_id, f"Linked {ent['name']} to {data.case_id}")
    return {"success": True, "message": f"{ent['name']} linked to case {data.case_id}."}
