# 08 — Implementation Roadmap

## 1. Phased Plan

### Phase 0 — Foundations (Week 1)
- Stand up core infrastructure: Neo4j, PostgreSQL, object storage, API gateway skeleton.
- Define the graph schema (file 03) as actual database constraints/migrations.
- Generate the UI screens in Google Stitch (file 06) and export to React scaffolding.
- Set up auth (even a simple OIDC/mock provider is fine for a hackathon) and the audit-log table from day one — retrofitting audit logging later is painful and it's cheap to include now.

### Phase 1 — MVP (hackathon-scope, roughly the next 1-2 weeks)
Goal: a working, demoable slice through the whole pipeline on a small, realistic dataset — not every feature in file 04, but every *stage* of the pipeline represented end to end.

- **Ingestion**: support at minimum a CSV upload path (CDR-style + a simple financial-transaction format) and plain-text FIR upload. Skip OCR/scanned-image support for MVP unless time allows — it's the most finicky part.
- **Extraction**: a working NER pass on free text (an off-the-shelf model fine-tuned lightly, or even a strong pre-trained model with light rule-based augmentation, is fine for MVP quality) plus deterministic parsing of the structured formats.
- **Entity resolution**: exact-match + basic fuzzy-match merging; skip phonetic matching and the full review-queue UI for MVP if time-constrained — auto-merge with a visible confidence label is an acceptable shortcut for a demo.
- **Graph**: full schema from file 03, populated from the above.
- **Analytics**: betweenness centrality and one community-detection pass (Louvain) — these are the two most demo-impressive, highest-value algorithms and both ship in Neo4j GDS with minimal custom code.
- **Anomaly detection**: pick **one** pattern type to implement well rather than three implemented shallowly — financial structuring detection is usually the most visually compelling for a demo.
- **UI**: Dashboard, Network Graph Explorer, and Entity Profile screens (prompts 1-3 in file 06) are the three that matter most for a demo — build these first.
- **Reporting**: a simple export (even a straightforward PDF of a sub-graph + entity list) is enough to close the "actionable intelligence" loop for a demo.

### Phase 2 — Full Product
- Complete remaining P0/P1 items from file 04: full review-queue UX, multilingual NLP, link prediction, geospatial/timeline views, case collaboration, watchlists, full RBAC and admin console.
- Build out the feedback loop (file 05 §9) so model quality improves from real usage.
- Formal security review and penetration test before any real case data touches the system.

### Phase 3 — Advanced / Stretch
- Cross-case pattern mining (same entity or pattern appearing across unrelated cases).
- Point-in-time/versioned graph queries for disclosure and investigative timeline reconstruction.
- Chargesheet-formatted export templates per agency.
- On-prem open-weight LLM option for fully air-gapped deployments.

## 2. Suggested Team Split (if building for a hackathon)

| Track | Owns |
|---|---|
| Data/Backend | Ingestion, extraction, entity resolution, graph writes (files 02, 03, 05 stages 1-4) |
| ML/Analytics | Network analytics, anomaly detection, LLM-assisted insights (file 05 stages 6-8) |
| Frontend | Stitch UI generation + React implementation (files 02, 06) |
| Product/Story | Demo narrative, sample dataset curation, pitch (this file, file 01) |

## 3. Sample Dataset Guidance

For a demo or MVP, build a small **synthetic** dataset (5-10 people, a couple of organizations, a handful of locations/vehicles, ~100-300 synthetic CDR records, ~20-30 synthetic transactions) that contains a few intentionally-hidden patterns:
- One "hidden broker" — a person with few direct connections to named suspects but who structurally bridges two clusters (for betweenness centrality to find).
- One structuring pattern — several sub-threshold transactions between related accounts (for anomaly detection to find).
- One burst-communication pattern tied to a specific date (for the CDR pattern detection to find).

This lets the demo show the system finding something a manual read-through would plausibly miss — which is the actual point of the product. **Never use real case or personal data for a demo or hackathon submission** — synthetic data avoids both a privacy problem and a security problem.

## 4. Suggested Demo Script (3-5 minutes)

1. **Open on the Dashboard** — show the KPI cards and a priority alert already flagged (sets up "the system already found something").
2. **Click into the flagged alert** — show the evidence-cited explanation (structuring pattern or burst communication), establishing the anomaly detection story.
3. **Jump to the Network Graph Explorer** for the related case — run "Key Influencers" analysis live, and show the hidden-broker node getting highlighted with its plain-language explanation ("connects 3 otherwise-separate groups") — this is the single most compelling moment in the demo.
4. **Click that entity's profile** — show its relationships table and source-document citations, reinforcing "everything traces back to real evidence."
5. **Close on the Report screen** — generate a one-click investigator brief, emphasizing the citation-anchored, human-in-the-loop framing from file 07.
6. **If asked about ethics/bias** (judges often will) — have file 07 open and be ready to speak to the human-in-the-loop and bias-mitigation sections directly; this is frequently what separates a technically impressive submission from a winning one in this problem space.

## 5. What to Emphasize in a Written/Pitch Submission

Based on the original problem statement's priorities, make sure these come through explicitly, not just implicitly in the build:
- **Multi-source fusion** (FIRs + CDRs + financial + surveillance + SOCMINT + criminal history) — the core value proposition is connecting these, not any single source in isolation.
- **Key-influencer identification**, specifically the "hidden broker" (betweenness centrality) story — it's the most concrete answer to "identify key individuals who play influential roles."
- **Explainability and human oversight** — this is both good engineering and directly addresses the reasonable concern any reviewer will have about AI in a law-enforcement context.
- **Actionable, not just impressive** — tie every AI output back to "what does an investigator do next," per the problem statement's request for "actionable intelligence."
