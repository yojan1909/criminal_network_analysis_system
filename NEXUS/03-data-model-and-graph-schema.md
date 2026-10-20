# 03 — Data Model & Graph Schema

## 1. Design Principles

- Every **node** represents a real-world entity; every **edge** represents an observed relationship — never inferred certainty. Confidence is a property, not a filter applied before storage.
- Every node and edge carries provenance: which source document(s) it came from, who/what created it (human or AI pipeline), and when.
- Nothing is silently overwritten. Entity resolution *merges* records but preserves the original source pointers so a merge can be audited or reversed.

## 2. Node Types

| Node Label | Key Properties | Notes |
|---|---|---|
| `Person` | `person_id`, `full_name`, `aliases[]`, `dob`, `gender`, `nationality`, `known_addresses[]`, `risk_score`, `confidence` | `risk_score` is analyst/AI-assisted, always shown with its contributing factors — never a bare number |
| `Organization` | `org_id`, `name`, `type` (gang/company/shell entity/NGO), `registration_no`, `known_addresses[]` | |
| `Location` | `location_id`, `name`, `address`, `lat`, `lng`, `location_type` (residence/hideout/business/border-point) | |
| `Vehicle` | `vehicle_id`, `registration_no`, `make_model`, `color`, `registered_owner_ref` | |
| `PhoneNumber` | `number`, `carrier`, `imei[]`, `first_seen`, `last_seen` | |
| `BankAccount` | `account_id`, `bank_name`, `account_holder_ref`, `account_type` | Financial instrument; can extend to card/wallet/crypto-address as sub-types |
| `Event` | `event_id`, `title`, `event_type` (crime/meeting/travel/transaction), `date`, `location_ref` | Ties multiple entities together at a point in time |
| `Document` | `document_id`, `source_type` (FIR/CDR/financial/surveillance/SOCMINT/criminal-history), `upload_date`, `uploaded_by`, `storage_ref` | Every extraction traces back here |
| `SocialMediaAccount` | `account_id`, `platform`, `handle`, `profile_url` | |
| `Case` | `case_id`, `title`, `status`, `assigned_officers[]`, `created_at` | Scoping container — most queries are filtered by case |
| `Insight` | `insight_id`, `type` (key_influencer/anomaly/pattern_match), `generated_by` (algorithm name), `confidence`, `explanation`, `reviewed_by`, `review_status` | AI-generated findings are first-class, reviewable objects — never silently merged into the graph as "fact" |

## 3. Relationship (Edge) Types

| Relationship | From → To | Key Properties | Example |
|---|---|---|---|
| `ASSOCIATE_OF` | Person → Person | `relationship_type` (family/friend/business/gang-affiliation), `confidence`, `source_document_id` | Two people named together in an FIR |
| `COMMUNICATED_WITH` | Person/PhoneNumber → Person/PhoneNumber | `call_count`, `total_duration`, `first_contact`, `last_contact`, `source_document_id` | Derived from CDR |
| `OWNS` / `REGISTERED_TO` | Person → Vehicle / BankAccount / PhoneNumber | `since_date`, `confidence` | |
| `MEMBER_OF` | Person → Organization | `role`, `since_date` | |
| `LOCATED_AT` | Person/Vehicle → Location | `timestamp`, `source_type` (surveillance/GPS/witness) | Time-stamped, supports timeline replay |
| `TRANSACTED_WITH` | BankAccount → BankAccount | `amount`, `currency`, `date`, `mode` (cash/transfer/UPI), `flagged_pattern` | Powers financial-structuring detection |
| `INVOLVED_IN` | Person/Org/Vehicle → Event | `role` (suspect/witness/victim/organizer) | |
| `MENTIONED_IN` | any entity → Document | `extraction_confidence`, `text_span` | Direct provenance link — "why does this node exist" |
| `LINKED_TO` | any → any | `inferred_by` (AI model/algorithm), `confidence`, `basis` | Generic fallback for AI-suggested links pending investigator confirmation — **never auto-promoted** to a typed relationship without review |

## 4. Example Graph Schema (Cypher)

```cypher
// Node constraints
CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.person_id IS UNIQUE;
CREATE CONSTRAINT phone_number IF NOT EXISTS FOR (n:PhoneNumber) REQUIRE n.number IS UNIQUE;
CREATE CONSTRAINT case_id IF NOT EXISTS FOR (c:Case) REQUIRE c.case_id IS UNIQUE;

// Example: create two persons and a communication link derived from a CDR
CREATE (a:Person {person_id: 'P-1001', full_name: 'Rizwan Khan', aliases: ['Guddu'], confidence: 0.95})
CREATE (b:Person {person_id: 'P-1002', full_name: 'Salim Sheikh', confidence: 0.90})
CREATE (a)-[:COMMUNICATED_WITH {
  call_count: 47,
  total_duration_min: 312,
  first_contact: date('2026-02-01'),
  last_contact: date('2026-03-15'),
  source_document_id: 'DOC-4471'
}]->(b);
```

```cypher
// Example query: find the shortest path between two persons of interest
MATCH path = shortestPath(
  (a:Person {person_id: 'P-1001'})-[*..5]-(b:Person {person_id: 'P-2044'})
)
RETURN path;
```

```cypher
// Example query: find likely intermediaries (people connected to both of two suspects
// but not previously flagged themselves) — the "hidden broker" pattern
MATCH (a:Person {person_id: 'P-1001'})--(x:Person)--(b:Person {person_id: 'P-2044'})
WHERE a <> b AND NOT (x)-[:INVOLVED_IN]->(:Event {event_type: 'crime'})
RETURN x.full_name, x.person_id, count(*) AS shared_connections
ORDER BY shared_connections DESC;
```

```cypher
// Example: PageRank to find influential nodes in a case sub-graph (using Neo4j GDS)
CALL gds.pageRank.stream('case-2026-114-graph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).full_name AS entity, score
ORDER BY score DESC
LIMIT 10;
```

## 5. Confidence & Provenance Convention (applies to every edge/node written by the pipeline)

```json
{
  "confidence": 0.87,
  "source_document_id": "DOC-4471",
  "extraction_method": "ner_model_v3 | rule_based | manual_entry | financial_import",
  "created_by": "system:extraction-service | user:officer_id",
  "created_at": "2026-08-14T10:22:00Z",
  "review_status": "auto_accepted | pending_review | confirmed | rejected"
}
```
This block (or its relational-table equivalent) should be attached to every AI-written node/edge so any output can be traced back and, if wrong, corrected or removed without corrupting the rest of the graph.

## 6. Supplementary Relational Tables (PostgreSQL)

- `users` (id, name, role, department, mfa_enabled)
- `roles_permissions` (role, resource, action) — see file 07 for the full RBAC model
- `cases` (id, title, status, created_by, created_at) — mirrors the `Case` graph node for relational joins/reporting
- `audit_log` (id, user_id, action, resource_type, resource_id, case_id, timestamp, justification) — append-only
- `documents_metadata` (id, case_id, source_type, upload_date, storage_ref, ocr_status)
