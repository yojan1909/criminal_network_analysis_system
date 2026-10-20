# AI-Powered Criminal Network Analysis System — Specification Suite

This is a complete, build-ready specification for the problem statement you provided, split into focused files so you can feed each one into the right place (an AI coding agent, Google Stitch, a hackathon submission form, a project wiki, etc.) without dumping everything into one context at once.

## What's in this package

| # | File | What it's for | Where to use it |
|---|------|---------------|------------------|
| 01 | `01-product-overview-and-prd.md` | Vision, problem framing, personas, scope, success metrics | Hackathon submission, project brief, first thing to give any AI coding agent |
| 02 | `02-system-architecture.md` | High-level architecture, tech stack, data flow | Context for backend/infra build-out |
| 03 | `03-data-model-and-graph-schema.md` | Entities, relationships, graph schema, sample Cypher | Database design, backend scaffolding |
| 04 | `04-features-and-functional-requirements.md` | Every module broken into numbered functional requirements | Sprint planning, backend/API scaffolding, QA checklist |
| 05 | `05-ai-ml-pipeline-and-algorithms.md` | NLP, entity resolution, graph analytics, anomaly detection, LLM layer | ML/data-science build-out |
| 06 | `06-google-stitch-ui-prompts.md` | Ready-to-paste prompts for Google Stitch, screen by screen | Paste directly into Stitch |
| 07 | `07-security-privacy-ethics-framework.md` | RBAC, audit trail, chain-of-custody, bias/oversight safeguards | Compliance section of submission, security design |
| 08 | `08-implementation-roadmap.md` | Phased build plan, MVP scope, demo script | Timeline planning, hackathon demo |

Read them in numeric order the first time. After that, they're independent — pull whichever one you need.

## Key assumptions made (change these if wrong)

Since you didn't specify a stack, platform, or jurisdiction, these defaults were chosen because they're the strongest fit for this exact problem — swap any of them out and the rest of the docs still hold:

1. **Delivery form**: a web-based "command center" application for investigators/analysts at a desk — not a public-facing or mobile-first consumer app. (UI in file 06 is written for web/desktop; say the word and I'll rewrite it mobile-first.)
2. **Jurisdiction context**: India (matches the source language of the problem statement — FIRs, CDRs, etc.), so file 07 references Indian data-protection and criminal-procedure concepts at a *general* level. This is not legal advice — get it reviewed by counsel before anything goes near real case data.
3. **Core database**: Neo4j (property graph) for relationships, PostgreSQL for structured case/records data, object storage for documents/media, OpenSearch/Elasticsearch for full-text search. This combination is the de facto standard for link-analysis products (Palantir, i2, Maltego all use a graph-first core).
4. **AI layer**: a fine-tuned NER/relation-extraction pipeline for structured extraction, plus an LLM (e.g., Claude via the Anthropic API) for natural-language querying and summarization — always with citations back to source records and a human sign-off step. The system never auto-labels anyone a "suspect" — it surfaces evidence and lets an investigator decide.
5. **UI**: designed in Google Stitch (per your instruction) and implemented in React/TypeScript.
6. **Deployment**: architected to run on-prem/air-gapped (a hard requirement for most real police/intelligence deployments), with cloud as an optional alternate, not the default.
7. **Scope for a hackathon MVP** vs. **full product**: file 08 separates these clearly — you don't need to build all of file 04 to have a working demo.

## One-paragraph pitch (for submission forms or as your first Stitch prompt)

> A unified AI-powered investigation platform that ingests FIRs, call detail records, financial transactions, surveillance reports, social media intelligence, and criminal history databases; automatically extracts people, organizations, locations, vehicles, phone numbers, and events using NLP; resolves and deduplicates entities across sources; builds a live relationship graph; runs network analytics (centrality, community detection, link prediction) to surface key influencers and hidden intermediaries; flags suspicious patterns (structuring, unusual communication bursts, anomalous co-location) for review; and gives investigators an interactive graph explorer, case management workspace, natural-language search, and one-click evidentiary reports — all under strict role-based access, full audit logging, and human-in-the-loop review at every AI-generated insight.

## Suggested next step

Open `01-product-overview-and-prd.md` first — everything else builds on the scope and personas defined there.
