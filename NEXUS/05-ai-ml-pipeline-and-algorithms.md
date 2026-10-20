# 05 — AI/ML Pipeline & Algorithms

## 1. Pipeline Overview

```
Raw Document/Record
      │
      ▼
[1] Pre-processing (OCR / format parsing / language detection)
      │
      ▼
[2] Entity Extraction (NER)
      │
      ▼
[3] Relation Extraction
      │
      ▼
[4] Entity Resolution (dedup + cross-source linking)
      │
      ▼
[5] Graph Write (with provenance + confidence)
      │
      ▼
[6] Network Analytics (centrality, community detection, link prediction)
      │
      ▼
[7] Anomaly / Pattern Detection
      │
      ▼
[8] LLM-Assisted Insight Generation (NL query, summarization, briefs)
      │
      ▼
Human Review & Sign-off (every stage above is reversible/correctable here)
```

## 2. Stage 1 — Pre-processing

- **OCR**: Tesseract (open-source, air-gap friendly) or a commercial OCR engine for higher accuracy on poor scans; layout-aware OCR (preserving tables) for financial statements.
- **Structured parsers**: deterministic column-mapping parsers for CDR and financial export formats — do **not** run these through NLP; treat them as structured data from the start for higher accuracy.
- **Language detection**: route free text to the correct language model; default pipeline should support English plus at least one major regional language relevant to the deployment (e.g., Hindi), extensible to others.

## 3. Stage 2-3 — Entity & Relation Extraction (NLP)

**Approach**: fine-tuned transformer NER + a lightweight relation-extraction layer, not a single end-to-end black box — this keeps each stage debuggable and independently improvable.

- **Base models**: a transformer NER model (e.g., a fine-tuned BERT/RoBERTa-family or spaCy transformer pipeline) fine-tuned on a **custom entity schema** matching file 03's node types: `PERSON`, `LOCATION`, `ORGANIZATION`, `VEHICLE`, `PHONE_NUMBER`, `BANK_ACCOUNT`, `WEAPON`, `DATE`, `EVENT`.
- **Domain fine-tuning data**: since generic NER models are trained on news/Wikipedia text, they under-perform on FIR-style writing (terse, formulaic, name-heavy, code-mixed language). Plan for a labeling effort on a representative sample of real (or realistic synthetic/anonymized) FIRs and reports — this is the single highest-leverage investment for extraction quality.
- **Multilingual/regional support**: for non-English text, use a multilingual base model (e.g., an IndicNLP/IndicBERT-family model or a strong multilingual transformer) rather than machine-translating first — translation loses named-entity precision (names, transliterations).
- **Relation extraction**: for a first version, use a pattern/dependency-parsing based approach (fast, explainable, good for formulaic FIR language: "X assaulted Y at Z on [date]"); layer in a learned relation classifier as labeled data accumulates. An instruction-following LLM (see Stage 8) can also assist here as a *secondary* extractor whose output is treated as lower-confidence and routed to review, not written directly.
- **Confidence scores**: propagate model confidence (softmax probability or calibrated score) all the way to the graph write — this is what drives the auto-accept vs. review-queue split in FR-2.5.

## 4. Stage 4 — Entity Resolution

- **Deterministic matching first**: exact match on unique identifiers (phone number, national ID, bank account number) — highest confidence, safe to auto-merge.
- **Fuzzy matching**: Levenshtein/Jaro-Winkler distance on names, thresholded and combined with contextual features (same case, same location, same time window) to reduce false merges.
- **Phonetic matching**: Soundex/Metaphone-style algorithms adapted for local naming conventions and transliteration variance (e.g., "Rizwan" vs. "Rizvan").
- **Record-linkage framework**: consider an existing probabilistic record-linkage library (e.g., Splink or Dedupe-style approach) rather than hand-rolling — these handle the precision/recall tuning and blocking-for-performance problem well.
- **Golden rule**: false merges are worse than missed merges (a false merge can wrongly attribute one person's history to another). Bias thresholds conservatively; route ambiguous cases to human review rather than auto-merging.

## 5. Stage 6 — Network Analytics

All of the below are available out-of-the-box in Neo4j's Graph Data Science (GDS) library, or via NetworkX for prototyping.

| Algorithm | What it answers | Use in this system |
|---|---|---|
| Degree centrality | Who has the most direct connections? | Quick first-pass "who's central" view |
| Betweenness centrality | Who sits on the most shortest-paths between others? | **Highest value metric** — surfaces intermediaries/brokers who aren't necessarily the most "connected" but are structurally critical |
| PageRank / eigenvector centrality | Who is connected to *important* people, not just many people? | Surfaces influence, not just activity |
| Louvain / Leiden community detection | What sub-groups/cells exist within a larger network? | Splits a sprawling network into investigable clusters; often reveals cell structure |
| Node similarity / node2vec embeddings | Which entities behave similarly in the graph even without a direct link? | Basis for link prediction and "entities like this one" |
| Link prediction (e.g., Adamic-Adar, or a trained classifier over embeddings) | Which unconfirmed relationships are structurally likely? | Generates investigative leads — **always surfaced as a suggestion**, never as a confirmed edge |
| Shortest path / all-paths | How is A connected to B, and through whom? | Core "how are these two people connected" investigator query |

## 6. Stage 7 — Anomaly & Suspicious Pattern Detection

Combine three complementary approaches — no single technique catches everything:

1. **Rule-based typology matching** (fast, explainable, catches known patterns immediately):
   - Financial structuring/smurfing: multiple transactions just under a reporting threshold, in a short time window, between related accounts.
   - Round-tripping: funds moving through a cycle of accounts back near the origin.
   - Burst communication: a spike in contact frequency between two numbers immediately before/after a flagged event.

2. **Statistical baselining**: z-score/percentile-based flagging of behavior that deviates from an entity's own historical baseline or its peer group's typical pattern (e.g., transaction volume, call frequency).

3. **ML-based anomaly detection**: unsupervised models (Isolation Forest, Local Outlier Factor, or autoencoder-based approaches for higher-dimensional feature sets) over engineered features (transaction velocity, network position change over time, geographic dispersion) to catch anomalies that don't match a known rule.

**Every alert must cite the specific records (transactions, calls, locations) that triggered it** — an anomaly score alone is not actionable and erodes investigator trust if it can't be inspected.

## 7. Stage 8 — LLM-Assisted Insight Generation

Use an LLM (e.g., Claude via the Anthropic API for hosted deployments, or a securely self-hostable open-weight model for air-gapped environments) for the tasks language models are actually good at — never as the source of truth for facts:

- **Natural-language query translation**: turn "show me everyone connected to X within 2 hops who transacted over ₹1,00,000 in the last 6 months" into a Cypher query against the graph, execute it, and return the real results — the LLM writes the query, the graph database returns the facts.
- **Summarization**: turn a sub-graph + linked documents into a plain-language investigator brief draft, with every claim citing the specific source document/record it came from.
- **Explanation generation**: turn a raw centrality/anomaly score into the plain-language "why" shown in the UI (FR-5.6, FR-6.5).

**Guardrails** (non-negotiable, ties to file 07):
- The LLM never writes directly to the graph or asserts a new fact — it only summarizes/queries what the graph and extraction pipeline already established with their own confidence scores.
- Every LLM-generated sentence in a brief must be traceable to a specific source document or graph query result.
- No LLM output is presented as a conclusion about guilt, involvement, or intent — only as an organized presentation of what the data shows, for a human investigator to interpret.

## 8. Suggested Libraries/Tools Summary

| Purpose | Library/Tool |
|---|---|
| NER / NLP pipeline | spaCy, HuggingFace Transformers |
| Multilingual/regional NLP | Multilingual or region-specific transformer models (fine-tuned) |
| OCR | Tesseract (air-gap friendly) |
| Record linkage / entity resolution | Splink or a Dedupe-style probabilistic matcher |
| Graph analytics | Neo4j Graph Data Science library, NetworkX (prototyping) |
| Anomaly detection | scikit-learn (Isolation Forest, LOF), custom rule engine |
| LLM layer | Anthropic Claude API (hosted) or self-hosted open-weight model (air-gapped) |

## 9. Model Evaluation & Feedback Loop

- Maintain a held-out, representative validation set for extraction and resolution accuracy; re-evaluate after every retraining.
- Every human correction in the review queues (accept/edit/reject on extraction, confirm/reject on merges, true/false-positive on alerts) should be logged and periodically used to retrain/re-tune the relevant model — this is what turns a static pipeline into one that improves per deployment.
- Track precision/recall separately per entity type and per data source — a model doing well on FIRs may do poorly on social-media text, and averaging hides that.
