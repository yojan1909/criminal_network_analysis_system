"""
Nexus Intelligence Command Center — AI Copilot & Status Routes
Provides interactive natural-language QA and LLM diagnostics.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.ai_service import ai_service
from backend.database import get_db, dict_row, log_audit

router = APIRouter(prefix="/api/ai", tags=["ai"])


class CopilotChatRequest(BaseModel):
    message: str
    case_id: Optional[str] = "CS-2024-8841"
    history: Optional[List[Dict[str, str]]] = []


@router.get("/status")
def get_ai_status():
    """
    Get current AI status, active model, and provider configuration.
    """
    return ai_service.get_status()


@router.post("/chat")
def copilot_chat(data: CopilotChatRequest):
    """
    Interactive AI Copilot for investigating a case.
    Retrieves live entities, alerts, transactions, and relationships from the database
    to provide factual, evidence-grounded answers.
    """
    case_context = {
        "case_id": data.case_id,
        "title": "Operation Hydra",
        "entities": [],
        "alerts": [],
        "relationships": [],
        "transactions": [],
    }

    with get_db() as conn:
        if data.case_id:
            c = conn.execute("SELECT * FROM cases WHERE id = ?", (data.case_id,)).fetchone()
            if c:
                case_context["title"] = c["title"]
                case_context["description"] = c["description"]

            # Fetch top entities in case
            ents = conn.execute("""
                SELECT id, name, entity_type, risk_score, description
                FROM entities WHERE case_id = ?
                ORDER BY risk_score DESC LIMIT 15
            """, (data.case_id,)).fetchall()
            case_context["entities"] = [dict(e) for e in ents]

            # Fetch alerts
            alts = conn.execute("""
                SELECT id, title, severity, alert_type, description
                FROM alerts WHERE case_id = ?
                ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END LIMIT 10
            """, (data.case_id,)).fetchall()
            case_context["alerts"] = [dict(a) for a in alts]

            # Fetch transactions
            txns = conn.execute("""
                SELECT source_account, target_account, amount, currency, flagged, flagged_pattern
                FROM transactions WHERE case_id = ? LIMIT 10
            """, (data.case_id,)).fetchall()
            case_context["transactions"] = [dict(t) for t in txns]

    # Generate response
    reply = ai_service.chat_copilot(data.message, case_context, data.history)

    log_audit("AN-89241", "AI_COPILOT_QUERY", "copilot", data.case_id, data.case_id,
              details=f"Query: {data.message[:80]}")

    return {
        "reply": reply,
        "case_id": data.case_id,
        "active_model": ai_service.get_status()["active_model"],
        "context_entities_count": len(case_context["entities"]),
        "context_alerts_count": len(case_context["alerts"]),
    }


@router.get("/verify")
def verify_live_api_key():
    """
    Directly verify if the live API key is valid and operational.
    Sends a test ping to Groq/LLM and measures latency and accuracy.
    """
    import time
    start_t = time.time()
    status = ai_service.get_status()
    provider = status.get("active_provider")
    model = status.get("active_model")
    
    key = ""
    if provider == "groq":
        key = ai_service.config.GROQ_API_KEY
    elif provider == "gemini":
        key = ai_service.config.GEMINI_API_KEY
    elif provider == "openai":
        key = ai_service.config.OPENAI_API_KEY

    masked_key = f"{key[:8]}...{key[-4:]}" if len(key) > 12 else (key or "None")

    # Perform actual live test call
    try:
        test_out = ai_service._call_llm(
            system_prompt="You are a system diagnostic tool for NEXUS Intelligence.",
            user_prompt="Respond strictly with: LIVE_API_VERIFIED_OPERATIONAL",
            json_mode=False
        )
        latency_ms = round((time.time() - start_t) * 1000, 1)

        is_valid = bool(test_out and len(test_out.strip()) > 0)
        return {
            "status": "ONLINE_ACTIVE" if is_valid else "ERROR",
            "api_key_valid": is_valid,
            "provider": provider,
            "model": model,
            "masked_key": masked_key,
            "latency_ms": latency_ms,
            "test_output": test_out.strip() if test_out else "No response",
            "message": f"Live API key for {provider.upper()} ({model}) is VERIFIED and WORKING ({latency_ms}ms roundtrip)." if is_valid else "API key test failed."
        }
    except Exception as e:
        latency_ms = round((time.time() - start_t) * 1000, 1)
        return {
            "status": "ERROR",
            "api_key_valid": False,
            "provider": provider,
            "model": model,
            "masked_key": masked_key,
            "latency_ms": latency_ms,
            "error": str(e),
            "message": f"API call failed: {e}"
        }
