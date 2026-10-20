# 02 — System Architecture

## 1. Architecture at a Glance

```
                              ┌─────────────────────────────────────────┐
                              │              CLIENT LAYER                │
                              │   React/TypeScript Web App (Command      │
                              │   Center UI — designed in Google Stitch) │
                              └───────────────────┬───────────────────────┘
                                                  │  HTTPS / REST + WebSocket (live alerts)
                              ┌───────────────────▼───────────────────────┐
                              │              API GATEWAY                  │
                              │   AuthN/AuthZ (OIDC + RBAC), rate limits,  │
                              │   request routing, audit logging hook     │
                              └───────────────────┬───────────────────────┘
                 ┌───────────────────┬─────────────┼─────────────┬───────────────────┐
                 ▼                   ▼             ▼             ▼                   ▼
        ┌───────────────┐  ┌────────────────┐ ┌──────────┐ ┌──────────────┐ ┌────────────────┐
        │  INGESTION &   │  │  NLP / ENTITY   │ │  GRAPH   │ │  ANALYTICS &  │ │  CASE & REPORT  │
        │  NORMALIZATION │─▶│  EXTRACTION     │▶│  ENGINE  │▶│  ANOMALY      │ │  SERVICE        │
        │  SERVICE       │  │  SERVICE        │ │  SERVICE │ │  DETECTION    │ │                 │
        └───────┬────────┘  └────────┬────────┘ └────┬─────┘ └──────┬────────┘ └────────┬────────┘
                │                    │                │              │                   │
                ▼                    ▼                ▼              ▼                   ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────┐
        │                                    DATA LAYER                                            │
        │  Neo4j (graph: entities & relationships) · PostgreSQL (case mgmt, users, structured recs) │
        │  Object Storage / MinIO-S3 (raw docs, media) · OpenSearch (full-text search & audit log)   │
        └───────────────────────────────────────────────────────────────────────────────────────┘

        Cross-cutting: Audit & Logging Service · Job Queue / Orchestrator (async ingestion+ML jobs)
```

## 2. Component Breakdown

### 2.1 Client Layer
- React + TypeScript SPA. Graph visualization via a force-directed/graph rendering library (Cytoscape.js or Sigma.js — both handle 1,000s of nodes with good performance).
- Geospatial views via Leaflet/Mapbox for location-based analysis.
- Real-time alert updates via WebSocket subscription to the alerting service.

### 2.2 API Gateway
- Single entry point; enforces authentication (OIDC, integrable with department SSO/Active Directory) and role-based authorization on every route.
- Every request is tagged with a correlation ID and forwarded to the Audit & Logging Service — see file 07.

### 2.3 Ingestion & Normalization Service
- Accepts uploads: PDFs, scanned images (OCR), CSV/Excel (CDRs, transaction exports), plain text, and API pulls from connected systems.
- Normalizes into a common intermediate schema (source type, raw payload, metadata: source system, upload timestamp, uploading officer, case ID) before handing off to extraction.
- Runs asynchronously via a job queue (e.g., Celery/RQ over Redis, or a managed equivalent) — ingestion of large batches must not block the UI.

### 2.4 NLP / Entity Extraction Service
- Named Entity Recognition + relation extraction over free text (see file 05 for model details).
- Structured-source parsers for CDRs and financial records (deterministic field mapping, not NLP, since these are already structured).
- Entity Resolution sub-module: fuzzy + phonetic matching to merge "Mohd. Rizwan Khan," "M. Rizwan," and "Rizwan Khan (alias Guddu)" into one node — with a confidence score and a human review queue for anything below a high-confidence auto-merge threshold.
- Outputs entities + relationships as candidate graph writes, queued for the Graph Engine.

### 2.5 Graph Engine Service
- Owns writes to Neo4j: node/edge creation, deduplication merges, versioning (every edge has a `source_document_id`, `confidence`, `created_by`, `created_at`).
- Exposes a query API (Cypher under the hood) for: neighborhood expansion, shortest path, common-neighbor queries, sub-graph extraction for a case.

### 2.6 Analytics & Anomaly Detection Service
- Runs graph algorithms (centrality, community detection, link prediction) on demand and on schedule — see file 05.
- Runs anomaly detection jobs (statistical + ML) over transactions/CDRs on a schedule (e.g., nightly) and on-demand for a selected sub-graph.
- Writes results as **Insights** — a first-class object type (see file 03) that always references the entities/edges/evidence it's based on.

### 2.7 Case & Report Service
- Case management CRUD: case files, notes, entity/evidence linking, status/workflow (open → under investigation → chargesheet-ready → closed).
- Report generation: turns a selected sub-graph + case notes into a formatted investigator brief (PDF/DOCX) with citations back to source documents.

### 2.8 Cross-cutting Services
- **Audit & Logging Service**: immutable, append-only log of every read/write/query against case data — who, what, when, why (linked case/purpose). See file 07.
- **Job Queue / Orchestrator**: coordinates async pipelines (ingest → extract → resolve → graph-write → re-run analytics).
- **Notification Service**: pushes alerts (new high-severity anomaly, new match on a watchlist entity) to relevant users' dashboards and, optionally, email/SMS gateway (on-prem compatible).

## 3. Recommended Tech Stack

| Layer | Recommendation | Why |
|---|---|---|
| Frontend | React + TypeScript, Cytoscape.js/Sigma.js, Tailwind | Mature, performant graph rendering, matches Stitch's HTML/CSS export well |
| API layer | Python (FastAPI) | Async-friendly, best ecosystem overlap with the NLP/ML stack |
| Graph database | Neo4j (Community or Enterprise) + Graph Data Science (GDS) library | Purpose-built for exactly this problem; GDS ships centrality/community/link-prediction algorithms out of the box |
| Relational store | PostgreSQL | Case management, users/roles, structured audit metadata |
| Search | OpenSearch / Elasticsearch | Full-text search across reports and audit logs |
| Object storage | MinIO (self-hosted S3-compatible) or cloud S3 | Raw documents, scanned images, media evidence |
| Job queue | Redis + Celery (or RQ) | Async ingestion/ML pipelines |
| NLP/ML | spaCy, HuggingFace Transformers, custom fine-tuned NER, Neo4j GDS, scikit-learn (Isolation Forest) | See file 05 |
| LLM layer | Anthropic Claude via API (or any securely hostable LLM for air-gapped deployments) | Natural-language querying, summarization, drafting briefs — always with citation and human review |
| Auth | OIDC / Keycloak (self-hostable), integrable with department AD/SSO | Air-gap friendly identity provider |
| Deployment | Docker + Kubernetes, designed for on-prem/air-gapped first, cloud-portable | Matches real deployment constraints in this domain |

## 4. Data Flow (end-to-end example)

1. Analyst uploads a scanned FIR PDF and a CDR CSV for Case #2026-114.
2. Ingestion service OCRs the PDF, parses the CSV, and queues both for extraction.
3. NLP service extracts entities from the FIR text (2 persons, 1 vehicle, 1 location) and structured-parses the CDR (12 phone numbers, 340 call records).
4. Entity Resolution checks these against existing graph nodes — matches one phone number to an existing "person of interest" node from a prior case.
5. Graph Engine writes new nodes/edges, all tagged with source document IDs and confidence scores; low-confidence matches go to a review queue.
6. Analytics service is triggered (on new-data event) to recompute centrality scores for the affected sub-graph and re-run anomaly detection over the new CDR data.
7. A new high-severity anomaly ("unusual call burst between two previously unconnected numbers the night before the incident") is raised as an Insight and pushed to the assigned investigator's dashboard.
8. Investigator opens the Network Graph Explorer, reviews the flagged pattern, confirms it's relevant, and adds it to the case's evidence set for the eventual report.

## 5. Deployment Notes

- Architect every service to run fully within a single isolated network segment (no hard dependency on external APIs at runtime) — provide a pluggable interface for the LLM layer so an on-prem/open-weight model can be substituted where internet access to a hosted API isn't permitted.
- Support multi-tenancy at the *case* level (strict data segregation between unrelated cases/units) even within a single deployment.
- Horizontal scaling target: ingestion and NLP extraction are the most compute-heavy and should scale independently of the API/UI tier.
