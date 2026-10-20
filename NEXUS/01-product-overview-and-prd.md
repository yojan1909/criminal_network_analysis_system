# 01 — Product Overview & Product Requirements Document (PRD)

## 1. Problem Statement (refined)

Law enforcement and intelligence agencies already collect enormous volumes of data — FIRs, call detail records (CDRs), financial transactions, surveillance reports, social media intelligence, and criminal history databases — but this data is **fragmented across systems, unstructured in format, and disconnected from one another**. A single suspect might appear as a name in an FIR, a number in a CDR, an account holder in a bank record, and a face in a surveillance report, with nothing automatically linking the four. Investigators currently connect these dots manually, which is slow, inconsistent across teams, and prone to missing non-obvious relationships — especially the "weak ties" (a shared accountant, a common safe house, an intermediary who never talks on the phone) that hold a network together.

## 2. Vision

Give every investigator a single workspace where **any entity — a person, a phone number, an account, a location — can be searched once and its entire web of relationships appears instantly**, with AI doing the tedious work of reading documents, extracting entities, and flagging what's statistically unusual, so investigators spend their time on judgment calls instead of data wrangling.

## 3. Goals

| Goal | Why it matters |
|---|---|
| Automatically extract structured entities from unstructured reports | Removes the single biggest manual bottleneck (reading and re-keying FIRs/reports) |
| Unify siloed data sources into one relationship graph | Hidden connections only appear when data sources are merged |
| Surface key individuals (hubs, brokers, financiers) automatically | Manual network mapping misses non-obvious "bridge" individuals |
| Detect suspicious patterns without a human having to know what to look for | Anomalies (structuring, burst communication) are easy for algorithms, easy to miss by eye |
| Keep every AI output traceable, auditable, and reviewable by a human | Evidentiary integrity and accountability are non-negotiable in this domain |

## 4. Non-Goals (explicitly out of scope)

- This system does **not** perform autonomous surveillance, live phone/communications interception, or facial recognition against live camera feeds — it works on data already lawfully collected and provided to it.
- This system does **not** make arrest, charge, or guilt determinations. It produces leads and evidence maps for a human investigator, never a verdict.
- This system does **not** replace an evidence-management/chain-of-custody system of record — it links to source documents, it doesn't own legal custody of them.
- No public or civilian-facing surface. Internal tool for authorized personnel only.

## 5. Target Users / Personas

**Investigating Officer (primary user)**
Needs to quickly answer: "Who is this person connected to, how, and is any of it unusual?" Time-poor, not a data scientist, wants answers in plain language and a graph they can point to in a case diary.

**Intelligence Analyst**
Works across many cases looking for cross-case patterns (same phone number appearing in three unrelated FIRs, same financier behind two different gangs). Needs powerful querying, saved searches, and network-wide (not just single-case) analytics.

**Case Supervisor / Senior Officer**
Needs a portfolio view across all active cases, resourcing/priority signals (which cases have the most "hot" flagged patterns), and sign-off workflows before anything goes into a chargesheet.

**System/Data Administrator**
Manages data source integrations, user roles and permissions, and audit compliance. Not an investigator — never sees case content beyond what's needed to administer it.

## 6. Core User Journeys

1. **Ingest → Extract**: Analyst uploads a batch of FIRs (PDF/scanned) and a CDR export (CSV). System OCRs/parses them, extracts entities (people, numbers, locations, vehicles), and shows a review queue of extracted entities with confidence scores before they're merged into the graph.
2. **Search → Explore**: Investigator searches a phone number. System returns the resolved entity (owner, aliases, known associates) and opens an interactive graph centered on that node, expandable hop by hop.
3. **Analyze → Discover**: Analyst runs "find key influencers" on a case's network. System ranks entities by centrality/betweenness and flags the top 5 "bridge" individuals who aren't the obvious named suspects.
4. **Detect → Alert**: System runs nightly anomaly detection across recent transactions and CDRs, flags a cluster of accounts showing structuring behavior, and raises a reviewable alert with the supporting evidence.
5. **Report → Export**: Investigator selects a sub-graph and generates an investigator brief (PDF/Word) summarizing entities, relationships, and evidence citations, ready to attach to a case file.

## 7. Success Metrics

| Metric | Target (illustrative — tune per deployment) |
|---|---|
| Time to build a relationship map for a new case | From hours/days (manual) to minutes |
| % of entities correctly auto-extracted (precision) | ≥ 90% for structured sources (CDR, financial), ≥ 80% for free-text reports |
| % of duplicate entities correctly merged (entity resolution) | ≥ 95% precision on merges (false merges are worse than missed ones) |
| Analyst-rated usefulness of "key influencer" suggestions | Majority rated "actionable" in review |
| False positive rate on anomaly alerts | Tuned down over time via analyst feedback loop |
| Every AI-surfaced fact traceable to a source document | 100% — non-negotiable |

## 8. Constraints & Design Principles

- **Human-in-the-loop by default**: nothing auto-merges, auto-accuses, or auto-closes without a review step for anything above a low-confidence threshold.
- **Explainability over black-box scores**: every "key individual" or "suspicious pattern" surfaced must show *why* (which edges, which metric, which evidence).
- **Air-gap capable**: architecture must not assume permanent internet access — many real deployments are on isolated government networks.
- **Data minimization**: only ingest and retain what's lawfully authorized for the case at hand; support retention/purge policies.
- **Multi-source, multi-format from day one**: PDFs, scanned images, spreadsheets/CSVs, free text, structured DB exports — the ingestion layer must not assume clean input.
- **Regional language support**: reports and FIRs won't always be in English — NLP pipeline needs multilingual support (see file 05).

## 9. Assumptions

- Users are pre-vetted, authorized personnel operating under existing legal authority for the data they upload — this system is an analysis layer, not an authorization or collection mechanism.
- Source systems (CDR providers, bank records, criminal databases) can provide exports in some machine-readable or scannable form.
- A legal/compliance function exists in the deploying organization to define retention rules, access policies, and audit review cadence (this spec provides the framework; the organization sets the actual policy values).
