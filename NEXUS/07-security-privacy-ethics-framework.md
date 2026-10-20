# 07 — Security, Privacy & Ethics Framework

> This file describes design-level safeguards, not legal advice. Have qualified legal counsel review data handling, retention, and access policies against applicable law before deploying against real case data — requirements vary by jurisdiction and agency mandate.

## 1. Why this file matters as much as the feature list

A system like this concentrates a lot of sensitive personal data and inferential power in one place. Two things follow from that: it needs strong technical safeguards, and — separately — it needs to be designed so its *outputs* can't be mistaken for conclusions they're not. Both are covered here.

## 2. Role-Based Access Control (RBAC)

| Role | Access |
|---|---|
| Investigating Officer | Full access to assigned cases only; cannot see cases they're not assigned to |
| Intelligence Analyst | Broader cross-case query access for pattern-of-life/network analysis, subject to sensitivity tier restrictions |
| Case Supervisor | Read access across their unit's cases, sign-off permissions on reports leaving the system |
| Data/System Administrator | User, role, and connector management — explicitly **no** default access to case content |
| Auditor (optional dedicated role) | Read-only access to audit logs, no access to case content itself |

Design principles:
- **Least privilege by default** — new users get no case access until explicitly granted.
- **Case-level, not just role-level, scoping** — being an "Investigating Officer" doesn't mean access to all cases, only assigned ones.
- **Sensitivity tiers on data sources** — some source types (e.g., informant identities, ongoing surveillance) may need a stricter access tier than general case data.
- **Mandatory MFA** for all accounts; SSO integration with the deploying organization's identity provider where available.
- **Time-boxed elevated access** for cross-case analyst queries, with justification captured (see audit log below).

## 3. Audit Trail

Every read, write, query, export, and administrative action is logged, immutably, with:

```
who      → user_id, role
what     → action type, resource (entity/case/document/report)
when     → timestamp
why      → linked case ID / stated justification for cross-case or elevated queries
result   → what was returned/changed (reference, not full payload, to avoid duplicating sensitive data in logs)
```

- Logs are **append-only** — no update or delete capability, even for administrators, through the normal application interface.
- Regular audit review should be a defined organizational process, not just a technical capability — the system should support it (searchable, exportable logs) but the *policy* of who reviews audit logs and how often is an organizational decision.
- Any export of data out of the system (report generation, GraphML/CSV export) is itself an audited, logged event.

## 4. Chain of Custody & Evidentiary Integrity

- Every fact in the system traces to a source document (`MENTIONED_IN` relationships in file 03) — this is what makes AI-generated summaries usable as *investigative leads* rather than untraceable assertions.
- The system is explicitly **not** the system of record for legal chain of custody of physical/digital evidence — it links to source documents and should integrate with (not replace) an agency's existing evidence management system.
- Merges, edits, and AI-corrections are versioned and reversible, so an entity's history can be reconstructed if a merge is later found to be wrong — important both for investigative accuracy and for any downstream disclosure obligations.

## 5. Human-in-the-Loop, By Design

This is the most important principle in the whole spec and it recurs in every module:

- **No AI-generated fact is written to the graph without a confidence score attached**, and anything below the auto-accept threshold sits in a review queue until a human confirms it.
- **No AI-generated "key influencer" or "anomaly" is presented as a conclusion** — always as a ranked/flagged item with a plain-language explanation and a link to the underlying evidence, explicitly for a human to evaluate.
- **The system never assigns guilt, involvement, or intent.** `risk_score` and similar fields (file 03) are always shown with their contributing factors, never as a bare number that could be misread as a verdict.
- **LLM-generated report text is always citation-anchored** to specific source documents (file 05, Stage 8) — an investigator should never have to trust a summary without being able to click through to what it's based on.
- Build a visible distinction in the UI between "confirmed" data (human-verified or deterministically matched) and "AI-suggested" data (pending review) — file 06's UI prompts already bake this in (e.g., alert panels labeled "AI-generated summary — verify against source records").

## 6. Bias & Fairness Considerations

- NLP and entity-resolution models trained on historical policing/case data can inherit and amplify existing biases (e.g., over-representation of certain communities or neighborhoods in historical data leading to skewed pattern-detection baselines). This is a known, well-documented risk in predictive-policing-adjacent systems generally.
- Mitigations to build in from the start, not bolt on later:
  - Evaluate extraction/anomaly-detection precision and false-positive rates **broken out by relevant demographic/geographic subgroups**, not just in aggregate — an average false-positive rate can hide a much higher rate for one group.
  - Treat "anomaly" as statistically defined (deviation from a baseline) and never let it silently become a proxy for a protected characteristic — e.g., don't let "unusual for this neighborhood" collapse into "unusual for this community" without checking what's actually driving the flag.
  - Keep the human review step meaningfully in the loop rather than a rubber stamp — track review-queue throughput; if reviewers are accepting 99%+ of AI suggestions without scrutiny, that's a process failure worth catching.
  - Periodically re-evaluate models against fresh validation data as the system is used, not just once at launch.

## 7. Data Minimization & Retention

- Ingest and retain only what's authorized for the specific case/investigation — avoid building a general-purpose surveillance database as a side effect of case-by-case ingestion.
- Support configurable retention/purge policies per data sensitivity tier, set by the deploying organization's policy (not hardcoded).
- Support a "right to be forgotten" / purge workflow for entities cleared of relevance (e.g., a witness who turns out to be unconnected), distinct from simply hiding them from view.

## 8. Legal & Regulatory Considerations (general, jurisdiction-dependent — confirm with counsel)

- Data protection obligations for handling personal data (e.g., purpose limitation, security safeguards, breach notification) will apply to a system like this in most jurisdictions — confirm the specific framework applicable to your deployment.
- Evidentiary admissibility standards for electronic/AI-assisted evidence vary by jurisdiction — confirm what documentation (provenance, chain of custody, methodology disclosure) is needed for outputs from this system to be usable in proceedings.
- Cross-border or inter-agency data sharing (if applicable) typically has its own authorization requirements, separate from internal system access control.

## 9. Deployment Security Baseline

- Encryption at rest and in transit for all stored data.
- Network segmentation / air-gap capability as the default assumption (file 02), not an afterthought.
- Regular security review/penetration testing before handling real case data, and on an ongoing cadence after.
- Secrets/credentials management via a dedicated vault, never hardcoded or stored alongside application data.
