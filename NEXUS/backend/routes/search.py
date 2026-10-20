"""Federated search and natural language query API routes."""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from backend.database import get_db, dict_row, log_audit
import re

router = APIRouter(prefix="/api/search", tags=["search"])


class NLQueryRequest(BaseModel):
    query: str
    case_id: Optional[str] = None


@router.get("")
def federated_search(
    q: str = Query(..., min_length=1),
    entity_type: Optional[str] = None,
    case_id: Optional[str] = None,
    limit: int = Query(default=20, le=50),
):
    """Search across entities, cases, documents, and alerts."""
    results = {"entities": [], "cases": [], "documents": [], "alerts": [], "total": 0}
    qp = f"%{q}%"

    with get_db() as conn:
        # Search entities
        eq = "SELECT * FROM entities WHERE (name LIKE ? OR aliases LIKE ? OR id LIKE ? OR description LIKE ? OR phone_number LIKE ? OR account_number LIKE ? OR vehicle_reg LIKE ?)"
        ep = [qp] * 7

        if entity_type:
            eq += " AND entity_type = ?"
            ep.append(entity_type)
        if case_id:
            eq += " AND case_id = ?"
            ep.append(case_id)

        eq += " ORDER BY risk_score DESC LIMIT ?"
        ep.append(limit)

        entities = conn.execute(eq, ep).fetchall()
        results["entities"] = [dict_row(e) for e in entities]

        # Search cases
        cases = conn.execute("""
            SELECT * FROM cases WHERE title LIKE ? OR description LIKE ? OR id LIKE ?
            ORDER BY updated_at DESC LIMIT ?
        """, (qp, qp, qp, limit)).fetchall()
        results["cases"] = [dict_row(c) for c in cases]

        # Search documents
        docs = conn.execute("""
            SELECT * FROM documents WHERE title LIKE ? OR summary LIKE ? OR id LIKE ?
            ORDER BY upload_date DESC LIMIT ?
        """, (qp, qp, qp, limit)).fetchall()
        results["documents"] = [dict_row(d) for d in docs]

        # Search alerts
        alerts = conn.execute("""
            SELECT * FROM alerts WHERE title LIKE ? OR description LIKE ? OR id LIKE ?
            ORDER BY created_at DESC LIMIT ?
        """, (qp, qp, qp, limit)).fetchall()
        results["alerts"] = [dict_row(a) for a in alerts]

    results["total"] = (len(results["entities"]) + len(results["cases"]) +
                        len(results["documents"]) + len(results["alerts"]))

    log_audit("AN-89241", "SEARCH", details=f"Query: {q}")
    return results


@router.post("/nl-query")
def natural_language_query(data: NLQueryRequest):
    """Parse a natural language query using AI service and return structured results."""
    from backend.ai_service import ai_service
    query = data.query.strip()
    response = {
        "query": data.query,
        "interpretation": "",
        "results": [],
        "cypher_equivalent": "",
        "model_used": "heuristic"
    }

    with get_db() as conn:
        # Fetch some known entity names for prompt context
        known = conn.execute("SELECT name FROM entities ORDER BY risk_score DESC LIMIT 15").fetchall()
        known_names = [k["name"] for k in known]

        # Call AI translation
        ai_trans = ai_service.translate_nl_query(query, known_names)
        response["interpretation"] = ai_trans.get("interpretation", "")
        response["cypher_equivalent"] = ai_trans.get("cypher_equivalent", "")
        response["model_used"] = ai_trans.get("model_used", "heuristic")

        target = ai_trans.get("target_entity")
        threshold = ai_trans.get("financial_threshold")
        intent = ai_trans.get("intent", "general")

        # 1. Target entity query
        if target:
            entity = conn.execute("SELECT id, name FROM entities WHERE name LIKE ?",
                                  (f"%{target}%",)).fetchone()
            if entity:
                eid = entity['id']
                rels = conn.execute("""
                    SELECT DISTINCT e.*, r.relationship_type, r.confidence as rel_confidence
                    FROM relationships r
                    JOIN entities e ON (e.id = r.target_entity_id OR e.id = r.source_entity_id)
                    WHERE (r.source_entity_id = ? OR r.target_entity_id = ?) AND e.id != ?
                """, (eid, eid, eid)).fetchall()
                response["results"] = [dict_row(r) for r in rels]
                return response

        # 2. Financial threshold query
        if threshold:
            txns = conn.execute("""
                SELECT t.*, es.name as source_name, et.name as target_name
                FROM transactions t
                LEFT JOIN entities es ON t.source_entity_id = es.id
                LEFT JOIN entities et ON t.target_entity_id = et.id
                WHERE t.amount >= ?
                ORDER BY t.amount DESC LIMIT 20
            """, (threshold,)).fetchall()
            response["results"] = [dict(t) for t in txns]
            return response

        # 3. Centrality / Key influencers
        if intent == "centrality" or any(w in query.lower() for w in ['influenc', 'central', 'key player', 'important', 'hub']):
            from backend.graph import analyze_centrality
            if not response["interpretation"]:
                response["interpretation"] = "Running betweenness centrality analysis to find key influencers"
            if not response["cypher_equivalent"]:
                response["cypher_equivalent"] = "CALL gds.betweenness.stream('case-graph') YIELD nodeId, score"
            results = analyze_centrality(case_id=data.case_id, algorithm='betweenness')
            response["results"] = results[:10]
            return response

        # 4. Pattern / Anomalies
        if any(w in query.lower() for w in ['structur', 'suspicious', 'anomal', 'unusual', 'pattern']):
            if not response["interpretation"]:
                response["interpretation"] = "Finding flagged transactions and anomaly alerts"
            if not response["cypher_equivalent"]:
                response["cypher_equivalent"] = "MATCH (a:Alert {alert_type: 'financial_structuring'}) RETURN a"

            alerts = conn.execute("""
                SELECT * FROM alerts WHERE alert_type LIKE '%structur%' OR alert_type LIKE '%anomal%'
                ORDER BY severity DESC
            """).fetchall()
            txns = conn.execute("""
                SELECT t.*, es.name as source_name, et.name as target_name
                FROM transactions t
                LEFT JOIN entities es ON t.source_entity_id = es.id
                LEFT JOIN entities et ON t.target_entity_id = et.id
                WHERE t.flagged = 1 LIMIT 20
            """).fetchall()
            response["results"] = [dict_row(a) for a in alerts] + [dict(t) for t in txns]
            return response

        # 5. Fallback / General search
        if not response["interpretation"]:
            response["interpretation"] = f"General search across all entity types for '{data.query}'"
        entities = conn.execute("""
            SELECT * FROM entities WHERE name LIKE ? OR aliases LIKE ? OR description LIKE ?
            ORDER BY risk_score DESC LIMIT 20
        """, (f"%{query}%", f"%{query}%", f"%{query}%")).fetchall()
        response["results"] = [dict_row(e) for e in entities]

    return response


@router.get("/suggestions")
def search_suggestions(q: str = Query(..., min_length=1)):
    """Auto-complete suggestions for search."""
    qp = f"%{q}%"

    with get_db() as conn:
        entities = conn.execute("""
            SELECT id, name, entity_type FROM entities
            WHERE name LIKE ? OR id LIKE ? OR aliases LIKE ? OR phone_number LIKE ?
            LIMIT 8
        """, (qp, qp, qp, qp)).fetchall()

        cases = conn.execute("""
            SELECT id, title FROM cases WHERE title LIKE ? OR id LIKE ? LIMIT 4
        """, (qp, qp)).fetchall()

    suggestions = []
    for e in entities:
        e = dict(e)
        suggestions.append({
            "text": e['name'],
            "subtext": f"{e['entity_type']} • {e['id']}",
            "type": "entity",
            "id": e['id'],
        })
    for c in cases:
        c = dict(c)
        suggestions.append({
            "text": c['title'],
            "subtext": c['id'],
            "type": "case",
            "id": c['id'],
        })

    return {"suggestions": suggestions}
