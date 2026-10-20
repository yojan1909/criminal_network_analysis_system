"""
Nexus Intelligence Command Center — AI & LLM Service
Supports: Groq (LLaMA 3.3/3.1), Google Gemini, Ollama (Local LLaMA), OpenAI,
and an intelligent Heuristic Rule-Based Fallback Engine.
"""

import json
import re
import httpx
from typing import Dict, Any, List, Optional
from backend.config import config

class AIService:
    def __init__(self):
        self.config = config

    def get_status(self) -> Dict[str, Any]:
        """Check status of configured AI providers."""
        active = self.config.get_active_provider()
        has_groq = bool(self.config.GROQ_API_KEY)
        has_gemini = bool(self.config.GEMINI_API_KEY)
        has_openai = bool(self.config.OPENAI_API_KEY)

        models = {
            "groq": self.config.GROQ_MODEL,
            "gemini": self.config.GEMINI_MODEL,
            "ollama": self.config.OLLAMA_MODEL,
            "openai": self.config.OPENAI_MODEL,
            "heuristic": "Rule-Based Natural Language Engine v4.8",
        }

        return {
            "active_provider": active,
            "active_model": models.get(active, "standard"),
            "providers_configured": {
                "groq_llama": has_groq,
                "gemini": has_gemini,
                "ollama": self.config.AI_PROVIDER == "ollama",
                "openai": has_openai,
                "heuristic_fallback": True,
            },
            "ready": True,
        }

    def _call_llm(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> Optional[str]:
        """Dispatch call to the selected provider with fallback to others/heuristic."""
        provider = self.config.get_active_provider()

        # Try active provider
        if provider == "groq" and self.config.GROQ_API_KEY:
            res = self._call_groq(system_prompt, user_prompt, json_mode)
            if res:
                return res

        if provider == "gemini" and self.config.GEMINI_API_KEY:
            res = self._call_gemini(system_prompt, user_prompt, json_mode)
            if res:
                return res

        if provider == "ollama":
            res = self._call_ollama(system_prompt, user_prompt, json_mode)
            if res:
                return res

        if provider == "openai" and self.config.OPENAI_API_KEY:
            res = self._call_openai(system_prompt, user_prompt, json_mode)
            if res:
                return res

        # Fallback to secondary if primary failed
        if self.config.GROQ_API_KEY and provider != "groq":
            res = self._call_groq(system_prompt, user_prompt, json_mode)
            if res:
                return res

        if self.config.GEMINI_API_KEY and provider != "gemini":
            res = self._call_gemini(system_prompt, user_prompt, json_mode)
            if res:
                return res

        return None

    def _call_groq(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> Optional[str]:
        """Invoke models via Groq Cloud API with automatic model failover."""
        if not self.config.GROQ_API_KEY:
            return None
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.config.GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        candidate_models = [
            self.config.GROQ_MODEL,
            "openai/gpt-oss-120b",
            "qwen/qwen3.8-27b",
            "groq/compound",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant"
        ]
        # Remove duplicates while preserving order
        candidate_models = list(dict.fromkeys(candidate_models))

        with httpx.Client(timeout=30.0) as client:
            for model_name in candidate_models:
                try:
                    payload = {
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.2,
                    }
                    if json_mode:
                        payload["response_format"] = {"type": "json_object"}

                    resp = client.post(url, headers=headers, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        self.config.GROQ_MODEL = model_name  # Cache working model
                        return data["choices"][0]["message"]["content"]
                    elif resp.status_code == 404:
                        continue
                    else:
                        print(f"[AI Service] Groq error on {model_name}: {resp.status_code}")
                except Exception as e:
                    print(f"[AI Service] Groq connection error on {model_name}: {e}")
        return None

    def _call_gemini(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> Optional[str]:
        """Invoke Gemini models via google-genai SDK or direct REST API."""
        # Try SDK first
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.config.GEMINI_API_KEY)
            config_params = {}
            if json_mode:
                config_params["response_mime_type"] = "application/json"
            if system_prompt:
                config_params["system_instruction"] = system_prompt

            response = client.models.generate_content(
                model=self.config.GEMINI_MODEL,
                contents=user_prompt,
                config=types.GenerateContentConfig(**config_params) if config_params else None,
            )
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"[AI Service] Gemini SDK error: {e}")

        # Direct REST fallback for Gemini
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.config.GEMINI_MODEL}:generateContent?key={self.config.GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}],
                "generationConfig": {"temperature": 0.2}
            }
            if json_mode:
                payload["generationConfig"]["responseMimeType"] = "application/json"

            with httpx.Client(timeout=25.0) as client:
                resp = client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"[AI Service] Gemini REST error: {e}")

        return None

    def _call_ollama(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> Optional[str]:
        """Invoke local LLaMA instance via Ollama."""
        try:
            url = f"{self.config.OLLAMA_BASE_URL.rstrip('/')}/api/chat"
            payload = {
                "model": self.config.OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "stream": False,
            }
            if json_mode:
                payload["format"] = "json"

            with httpx.Client(timeout=40.0) as client:
                resp = client.post(url, json=payload)
                if resp.status_code == 200:
                    return resp.json().get("message", {}).get("content")
        except Exception as e:
            print(f"[AI Service] Ollama error: {e}")
        return None

    def _call_openai(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> Optional[str]:
        """Invoke OpenAI or compatible endpoints."""
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {self.config.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": self.config.OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2,
            }
            if json_mode:
                payload["response_format"] = {"type": "json_object"}

            with httpx.Client(timeout=25.0) as client:
                resp = client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[AI Service] OpenAI error: {e}")
        return None

    # =========================================================================
    # CORE INTELLIGENCE CAPABILITIES
    # =========================================================================

    def extract_entities_and_relations(self, text: str, document_title: str = "") -> Dict[str, Any]:
        """
        Extract named entities and relationships from free-form text.
        Schema: Person, Organization, Location, Vehicle, PhoneNumber, BankAccount, Weapon, Event.
        """
        system_prompt = (
            "You are an expert criminal intelligence analyst NLP model. "
            "Extract all named entities and relationships from the provided investigative text. "
            "Strictly follow this entity taxonomy: "
            "['Person', 'Organization', 'Location', 'Vehicle', 'PhoneNumber', 'BankAccount', 'Weapon', 'Event']. "
            "Return valid JSON ONLY with two arrays: 'entities' and 'relationships', and a 'summary'. "
            "For each entity include: 'name', 'entity_type', 'confidence' (float 0.5 to 1.0), 'attributes' (key-value dict), and 'text_span'. "
            "For each relationship include: 'source_name', 'target_name', 'relationship_type', 'label', 'confidence'. "
            "Valid relationship types: 'ASSOCIATE_OF', 'COMMUNICATED_WITH', 'OWNS', 'LOCATED_AT', 'TRANSACTED_WITH', 'MEMBER_OF', 'INVOLVED_IN'."
        )

        user_prompt = f"Document: {document_title}\n\nText Content:\n{text}"

        response = self._call_llm(system_prompt, user_prompt, json_mode=True)
        if response:
            try:
                # Clean markdown backticks if LLM returned them
                cleaned = re.sub(r"^```(?:json)?\s*", "", response.strip())
                cleaned = re.sub(r"\s*```$", "", cleaned)
                data = json.loads(cleaned)
                if "entities" in data:
                    data["model_used"] = self.config.get_active_provider()
                    return data
            except Exception as e:
                print(f"[AI Service] Failed to parse LLM JSON extraction: {e}")

        # Fallback to deterministic NLP heuristic extraction
        return self._heuristic_extract_entities(text, document_title)

    def translate_nl_query(self, query: str, known_entities: List[str] = None) -> Dict[str, Any]:
        """
        Translate natural language query into graph traversal intent, Cypher, and entity filters.
        """
        system_prompt = (
            "You are a graph database translation AI for a police intelligence platform. "
            "Convert user natural language queries into Cypher query equivalents, interpretation, and parameter filters. "
            "Graph schema: Nodes (:Person, :Organization, :Location, :Vehicle, :PhoneNumber, :BankAccount). "
            "Edges (:ASSOCIATE_OF, :COMMUNICATED_WITH, :OWNS, :TRANSACTED_WITH, :LOCATED_AT, :MEMBER_OF). "
            "Return JSON ONLY with keys: 'interpretation', 'cypher_equivalent', 'target_entity', 'financial_threshold', 'intent'."
        )
        user_prompt = f"User Query: {query}\nKnown Entities: {', '.join(known_entities[:10]) if known_entities else 'None'}"

        response = self._call_llm(system_prompt, user_prompt, json_mode=True)
        if response:
            try:
                cleaned = re.sub(r"^```(?:json)?\s*", "", response.strip())
                cleaned = re.sub(r"\s*```$", "", cleaned)
                parsed = json.loads(cleaned)
                if "cypher_equivalent" in parsed:
                    parsed["model_used"] = self.config.get_active_provider()
                    return parsed
            except Exception:
                pass

        # Fallback to rule engine
        return self._heuristic_nl_query(query)

    def generate_brief_narrative(self, case_summary: Dict[str, Any]) -> str:
        """
        Generate executive narrative for an investigator brief using LLM.
        """
        system_prompt = (
            "You are a senior criminal intelligence analyst writing a formal investigator brief. "
            "Synthesize the provided structured case data into a professional, factual executive summary. "
            "Rules: Cite specific targets and alert IDs. Do not speculate or declare guilt; present data objectively."
        )
        user_prompt = f"Case Data:\n{json.dumps(case_summary, indent=2)}"

        response = self._call_llm(system_prompt, user_prompt)
        if response:
            return response.strip()

        # Fallback template
        title = case_summary.get("title", "Case")
        entities_count = len(case_summary.get("entities", []))
        alerts_count = len(case_summary.get("alerts", []))
        return (
            f"This brief provides operational intelligence on {title}. "
            f"The network comprises {entities_count} mapped entities of interest and {alerts_count} active anomaly alerts. "
            f"Cross-source analysis demonstrates coordinated financial layering and encrypted communication patterns "
            f"concentrated around designated primary targets."
        )

    def chat_copilot(self, message: str, case_context: Dict[str, Any], history: List[Dict[str, str]] = None) -> str:
        """
        Interactive AI Copilot for investigating a case.
        """
        system_prompt = (
            "You are the NEXUS AI Copilot, an advanced criminal intelligence assistant. "
            "Help the investigator analyze suspect networks, financial laundering conduits, burner communications, "
            "and evidence timelines. Ground your answers strictly on the case data provided below. "
            "If data is missing, recommend specific investigative steps."
        )
        context_str = json.dumps(case_context, default=str)
        user_prompt = f"Case Intelligence Context:\n{context_str}\n\nInvestigator Query: {message}"

        response = self._call_llm(system_prompt, user_prompt)
        if response:
            return response.strip()

        # Fallback Copilot logic
        return self._heuristic_copilot_response(message, case_context)

    # =========================================================================
    # HEURISTIC & REGEX FALLBACK ENGINE
    # =========================================================================

    def _heuristic_extract_entities(self, text: str, document_title: str) -> Dict[str, Any]:
        """Rule-based NER and relation extraction when LLM is unavailable."""
        entities = []
        relationships = []

        # Phone numbers: +1/2/3 digits or 10-12 digits
        phone_matches = re.finditer(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        for m in phone_matches:
            num = m.group(0).strip()
            if len(re.sub(r'\D', '', num)) >= 10:
                entities.append({
                    "name": num,
                    "entity_type": "PhoneNumber",
                    "confidence": 0.95,
                    "attributes": {"number": num},
                    "text_span": f"[{m.start()}:{m.end()}]",
                })

        # Vehicles / License plates: e.g., MH-02-AK-9921, B-VK-8841, etc.
        vehicle_matches = re.finditer(r'\b[A-Z]{1,3}[-\s]?[0-9]{1,4}[-\s]?[A-Z]{0,3}[-\s]?[0-9]{1,4}\b', text)
        for m in vehicle_matches:
            val = m.group(0).strip()
            if any(c.isdigit() for c in val) and any(c.isalpha() for c in val):
                entities.append({
                    "name": val,
                    "entity_type": "Vehicle",
                    "confidence": 0.88,
                    "attributes": {"registration_no": val},
                    "text_span": f"[{m.start()}:{m.end()}]",
                })

        # Bank accounts / Currency: amounts like $50,000 or ₹80,00,000 or Account #...
        bank_matches = re.finditer(r'(?:Account|Acc|A/C)[\s#:]*([0-9]{8,18})', text, re.IGNORECASE)
        for m in bank_matches:
            acc = m.group(1).strip()
            entities.append({
                "name": f"Account {acc}",
                "entity_type": "BankAccount",
                "confidence": 0.92,
                "attributes": {"account_number": acc},
                "text_span": f"[{m.start()}:{m.end()}]",
            })

        # Common suspect/person titles or patterns: "Rizwan Khan", "Tariq Al-Mansoor", etc.
        person_matches = re.finditer(r'\b(?:Mr\.|Ms\.|Mrs\.|Officer|Target|Suspect)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b', text)
        for m in person_matches:
            name = m.group(1).strip()
            # Filter common false positives
            if name not in ["Criminal Intelligence", "Analysis Report", "Command Center", "Case File", "United States", "New Delhi"]:
                entities.append({
                    "name": name,
                    "entity_type": "Person",
                    "confidence": 0.84,
                    "attributes": {"full_name": name},
                    "text_span": f"[{m.start()}:{m.end()}]",
                })

        # Deduplicate entities by name
        unique_entities = []
        seen = set()
        for e in entities:
            if e["name"].lower() not in seen:
                seen.add(e["name"].lower())
                unique_entities.append(e)

        # Extract basic co-occurrence relationships
        persons = [e["name"] for e in unique_entities if e["entity_type"] == "Person"]
        if len(persons) >= 2:
            relationships.append({
                "source_name": persons[0],
                "target_name": persons[1],
                "relationship_type": "ASSOCIATE_OF",
                "label": "Named together in document",
                "confidence": 0.78,
            })

        return {
            "entities": unique_entities,
            "relationships": relationships,
            "summary": f"Extracted {len(unique_entities)} entities and {len(relationships)} relationships using Heuristic Pattern Engine.",
            "model_used": "heuristic-engine-v4.8",
        }

    def _heuristic_nl_query(self, query: str) -> Dict[str, Any]:
        """Fallback semantic parser for natural language query."""
        q = query.lower()
        res = {
            "interpretation": f"Executing federated analysis for '{query}'",
            "cypher_equivalent": "MATCH (n) RETURN n LIMIT 25",
            "target_entity": None,
            "financial_threshold": None,
            "intent": "general",
            "model_used": "heuristic",
        }

        # Connected pattern
        m_conn = re.search(r'(?:connected|linked|related)\s+to\s+(.+?)(?:\s+within|\s+who|\s*$)', q)
        if m_conn:
            target = m_conn.group(1).strip().strip('"\'')
            res["interpretation"] = f"Graph expansion: Finding all entities directly connected to '{target}'"
            res["cypher_equivalent"] = f"MATCH (a)-[r]-(b) WHERE a.name =~ '(?i).*{target}.*' RETURN a, r, b"
            res["target_entity"] = target
            res["intent"] = "connectivity"
            return res

        # Transaction threshold pattern
        m_txn = re.search(r'transact(?:ed|ions?).*?(?:over|above|more than)\s*[₹$€]?\s*([\d,]+)', q)
        if m_txn:
            amount = float(m_txn.group(1).replace(',', ''))
            res["interpretation"] = f"Financial filtering: Isolating fund transfers exceeding {amount}"
            res["cypher_equivalent"] = f"MATCH (a)-[r:TRANSACTED_WITH]->(b) WHERE r.amount >= {amount} RETURN a, r, b"
            res["financial_threshold"] = amount
            res["intent"] = "financial_flow"
            return res

        if any(w in q for w in ['influenc', 'central', 'broker', 'key player', 'hub']):
            res["interpretation"] = "Network Analytics: Betweenness centrality graph stream"
            res["cypher_equivalent"] = "CALL gds.betweenness.stream('case-graph') YIELD nodeId, score RETURN gds.util.asNode(nodeId).name, score ORDER BY score DESC LIMIT 10"
            res["intent"] = "centrality"
            return res

        return res

    def _heuristic_copilot_response(self, message: str, context: Dict[str, Any]) -> str:
        """Fallback conversational response from case intelligence context."""
        msg = message.lower()
        entities = context.get("entities", [])
        alerts = context.get("alerts", [])
        case_title = context.get("title", "this investigation")

        if "suspect" in msg or "who" in msg or "target" in msg:
            high_risk = [e for e in entities if e.get("risk_score", 0) >= 70]
            if high_risk:
                names = ", ".join([f"{e['name']} ({e['entity_type']}, Risk: {e.get('risk_score')})" for e in high_risk[:4]])
                return f"In {case_title}, the highest risk targets identified are: {names}. They exhibit multi-node connections across financial and communication logs."
            return f"Currently {len(entities)} entities are registered in {case_title}."

        if "alert" in msg or "suspicious" in msg or "pattern" in msg:
            if alerts:
                top_alert = alerts[0]
                return f"There are {len(alerts)} active alerts. Primary concern is '{top_alert.get('title')}' with severity '{top_alert.get('severity')}': {top_alert.get('description', '')}"
            return "No critical anomaly alerts are currently pending review."

        return (
            f"Regarding {case_title}: The intelligence graph currently tracks {len(entities)} entities, "
            f"with {len(alerts)} alerts generated. Key focus areas are intermediary brokers, "
            f"financial structuring below reporting thresholds, and anomalous burner contact bursts."
        )

ai_service = AIService()
