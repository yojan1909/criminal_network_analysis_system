# 04 — Features & Functional Requirements

Each module lists numbered functional requirements (FR) with acceptance criteria, so this file can double as a build checklist / QA reference. Priority: **P0** = MVP-critical, **P1** = full-product, **P2** = advanced/stretch.

## Module 1 — Multi-Source Data Ingestion

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-1.1 | Accept file uploads: PDF, DOCX, image (scanned reports), CSV/XLSX (CDRs, financial exports), plain text | System validates file type/size, queues for processing, shows upload status | P0 |
| FR-1.2 | OCR scanned/image documents into machine-readable text | ≥85% character accuracy on typical scan quality; low-confidence pages flagged for manual review | P0 |
| FR-1.3 | Parse structured CDR formats (telecom-standard CSV/XML layouts) into normalized call-record schema | Handles at least the 2-3 most common carrier export formats; unmapped columns flagged, not silently dropped | P0 |
| FR-1.4 | Parse financial transaction exports (bank statements, UPI/transfer logs) into normalized transaction schema | Same as above for financial formats | P0 |
| FR-1.5 | API-based ingestion connector framework for direct integration with source systems | Pluggable connector interface; at least one reference connector implemented | P1 |
| FR-1.6 | Every ingested item tagged with source, case, uploader, and timestamp before entering the pipeline | 100% of ingested documents have complete metadata; nothing enters the graph un-attributed | P0 |
| FR-1.7 | Batch upload with progress tracking and per-item error reporting | User can upload 50+ files at once and see individual pass/fail status | P1 |

## Module 2 — NLP Entity & Relationship Extraction

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-2.1 | Extract named entities (Person, Location, Organization, Vehicle, Phone Number, Bank Account) from free text | Precision ≥80% on held-out validation set (see file 05 for model approach) | P0 |
| FR-2.2 | Extract relationships between co-mentioned entities within a document | Relation extraction attaches a relationship type + confidence, not just co-occurrence | P0 |
| FR-2.3 | Multilingual support (English + at least one regional language relevant to deployment) | Entity extraction runs on non-English source text without requiring pre-translation | P1 |
| FR-2.4 | Confidence scoring on every extracted entity/relationship | Every extraction has a numeric confidence surfaced in the review UI | P0 |
| FR-2.5 | Human review queue for extractions below auto-accept confidence threshold | Reviewer can accept/edit/reject; threshold is admin-configurable | P0 |
| FR-2.6 | Coreference resolution within a document ("he," "the accused" → correct entity) | Reduces duplicate/incomplete entity extraction from pronoun references | P1 |

## Module 3 — Entity Resolution & Deduplication

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-3.1 | Fuzzy string matching across name variants and transliterations | Matches "Mohd. Rizwan," "M. Rizwan Khan," "Rizwan" with a similarity score | P0 |
| FR-3.2 | Phonetic matching for names (handles spelling variation in transliteration) | Catches matches fuzzy string matching alone would miss | P1 |
| FR-3.3 | Cross-source identity linking (same phone number/ID number = same entity across sources) | Deterministic matches (exact ID/number match) auto-merge; fuzzy matches go to review | P0 |
| FR-3.4 | Merge review UI — side-by-side comparison before confirming a merge | Reviewer sees both source records and evidence before confirming; merges are reversible | P0 |
| FR-3.5 | Merge audit trail | Every merge/unmerge logged with who/when/why | P0 |

## Module 4 — Relationship Graph Construction & Storage

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-4.1 | Persist all resolved entities/relationships to the graph store per the schema in file 03 | All writes include provenance block | P0 |
| FR-4.2 | Support incremental graph updates as new data arrives (no full rebuild required) | New document ingestion updates only affected sub-graph | P0 |
| FR-4.3 | Case-scoped sub-graph views, with an option to view cross-case connections | User can toggle "this case only" vs. "show connections to other cases" | P1 |
| FR-4.4 | Versioned/point-in-time graph queries ("what did we know as of date X") | Supports investigative timeline reconstruction and disclosure requirements | P2 |

## Module 5 — Network Analysis (Key Influencer Identification)

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-5.1 | Degree centrality — who has the most direct connections | Computed on-demand for a selected sub-graph, results ranked and explained | P0 |
| FR-5.2 | Betweenness centrality — who bridges otherwise-unconnected clusters (likely intermediaries) | Same as above; this is the highest-value metric for finding non-obvious brokers | P0 |
| FR-5.3 | PageRank / eigenvector centrality — who is influential by connection quality, not just count | Same as above | P1 |
| FR-5.4 | Community detection (e.g., Louvain) to identify sub-groups/cells within a larger network | Visually groups the graph into detected communities with a modularity score shown | P1 |
| FR-5.5 | Link prediction — suggest likely-but-unconfirmed relationships worth investigating | Suggestions are clearly marked as AI-inferred, never rendered identically to confirmed edges | P2 |
| FR-5.6 | Every ranking/score result includes a plain-language explanation of *why* | e.g., "connects 3 otherwise-separate clusters" not just "score: 0.82" | P0 |

## Module 6 — Suspicious Pattern & Anomaly Detection

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-6.1 | Financial structuring detection (multiple sub-threshold transactions suggesting deliberate avoidance of reporting limits) | Flags clusters matching known structuring/layering typologies, with the specific transactions cited | P0 |
| FR-6.2 | Unusual communication pattern detection (sudden burst of contact, contact only around specific events) | Flags with the specific call records and time window cited | P0 |
| FR-6.3 | Geospatial-temporal co-occurrence detection (two persons of interest repeatedly in the same place at the same time without a known reason) | Flags with location + timestamp evidence | P1 |
| FR-6.4 | Configurable rule-based pattern library (known typologies) alongside statistical/ML detection | Admin can add/edit rule-based patterns without a code change | P1 |
| FR-6.5 | Every alert has a severity, a plain-language explanation, and a link to supporting evidence | No alert is a bare score — always explainable | P0 |
| FR-6.6 | Analyst feedback loop (mark alert as true positive/false positive) feeds back into tuning | False-positive rate should visibly improve over time per deployment | P1 |

## Module 7 — Investigator Dashboard & Visualization

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-7.1 | Interactive graph explorer — zoom, pan, expand/collapse neighborhoods, filter by entity/relationship type | Handles graphs of at least a few thousand nodes without becoming unusable | P0 |
| FR-7.2 | Entity profile panel — single view of an entity's full known relationships, aliases, and history | Opens on node click, shows tabs for relationships/timeline/documents | P0 |
| FR-7.3 | Timeline view — chronological replay of events/communications/transactions for a selected entity or case | Scrubber control, filterable by entity/event type | P1 |
| FR-7.4 | Map view — geospatial plotting of location-linked entities and events | Pin clustering for dense areas, filterable by date range | P1 |
| FR-7.5 | Natural-language search/query over the graph | e.g., "show everyone connected to X within 2 hops who transacted over ₹1,00,000 in the last 6 months" returns a correct filtered sub-graph | P1 |
| FR-7.6 | Saved views / bookmarks for recurring investigative questions | User can save a filtered graph state and return to it | P2 |

## Module 8 — Case Management & Collaboration

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-8.1 | Create/manage case files with status workflow | Cases move through defined states (open → investigating → chargesheet-ready → closed) | P0 |
| FR-8.2 | Link entities, documents, and Insights to a case | Everything relevant to a case is retrievable from one case view | P0 |
| FR-8.3 | Case notes and investigator annotations on entities/edges | Notes are attributed and timestamped, not anonymous free text | P0 |
| FR-8.4 | Multi-officer collaboration on a shared case (with permission scoping) | Two officers can work the same case; access is role/case scoped | P1 |
| FR-8.5 | Case-to-case cross-reference (flag when two cases share an entity) | Prompts analyst review rather than auto-merging cases | P1 |

## Module 9 — Alerting & Notifications

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-9.1 | Real-time in-app alert delivery for new high-severity Insights | Delivered via WebSocket/push to assigned case officers | P0 |
| FR-9.2 | Watchlist monitoring — alert when a watchlisted entity appears in newly ingested data | Configurable per-entity watchlists | P1 |
| FR-9.3 | Digest/summary notifications (daily/weekly rollup) | Configurable per user | P2 |

## Module 10 — Reporting & Export

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-10.1 | Generate an investigator brief (PDF/DOCX) from a selected sub-graph + case notes | Every fact in the generated report cites its source document | P0 |
| FR-10.2 | Export graph data (for use in other tools/for disclosure) in standard formats (GraphML, CSV, JSON) | Round-trips without data loss | P1 |
| FR-10.3 | Chargesheet-ready formatted export matching standard investigative report structure | Configurable template per deploying agency | P2 |

## Module 11 — Access Control, Audit & Administration

See file 07 for the full security/ethics framework. Functionally:

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FR-11.1 | Role-based access control scoped to case and data-source sensitivity | Users only see cases/data they're authorized for | P0 |
| FR-11.2 | Immutable audit log of every read/write/query | 100% coverage, tamper-evident storage | P0 |
| FR-11.3 | Admin console for user/role/source management | Non-engineer admin can manage users and connectors | P1 |
