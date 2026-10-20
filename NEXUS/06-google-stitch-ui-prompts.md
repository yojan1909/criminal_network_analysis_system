# 06 — Google Stitch UI Prompts

This file is written to be pasted directly into [Google Stitch](https://stitch.withgoogle.com). It follows Stitch's own recommended workflow: **one high-level prompt to establish the project → one detailed prompt per screen → small, single-focus follow-up prompts to refine.** Don't paste this whole file in at once — Stitch loses coherence with very long, multi-instruction prompts. Go section by section.

## Before you start

- **Medium**: choose **Web App** (this is a desktop analyst workstation, not a mobile app).
- **Model**: use the higher-quality/"Pro" model for your first pass on each screen — quality matters more than speed here — and the faster model for small iterative tweaks afterward.
- **Keep a copy of the "Design System Reference" section below open.** Stitch doesn't reliably remember earlier screens when you generate a new one, so paste the relevant bits of this style reference into every screen prompt (already done for you below) to keep colors/fonts/spacing consistent across the app. This is the single biggest thing that prevents your screens from looking like they came from different apps.
- **Iterate one change at a time.** After each screen generates, refine with small, specific follow-ups ("make the sidebar narrower," "increase contrast on the severity badges") rather than re-describing the whole screen. Screenshot each screen once you're happy with it, in case a later prompt causes Stitch to regenerate more than you wanted.

---

## Design System Reference (keep this handy, reuse the phrasing below)

> **Vibe**: A serious, trustworthy, data-dense "intelligence command center" — think a professional analytics/investigation platform, not a consumer app and not a Hollywood-hacker cliché. Calm, confident, high information density but clearly organized.
>
> **Colors**: Deep charcoal-navy background (near-black, #0B0F14). Slightly lighter panel/card surfaces (#141A21) with thin, subtle borders instead of heavy drop shadows. Primary accent is a cyan-teal (#22D3EE) used for active states, primary buttons, and links. Severity/status colors: amber for medium alerts, red for high/critical alerts, green for resolved/low-risk/confirmed. Primary text off-white (#E5E7EB), secondary text muted slate gray (#94A3B8).
>
> **Typography**: A clean modern sans-serif (like Inter or IBM Plex Sans) for all UI text and headings. A monospace font (like IBM Plex Mono) specifically for IDs, case numbers, phone numbers, and timestamps, to give data fields a precise, "real record" feel.
>
> **Components**: Rounded corners (8–12px radius) on cards and buttons, not sharp or fully pill-shaped. Left-hand persistent navigation rail with icon + label. Cards with clear headers and generous internal padding despite the overall data density. Badges/chips for status and entity-type tags, color-coded consistently.

---

## Prompt 0 — Establish the Project (paste this first)

```
An internal, professional intelligence analysis platform for law enforcement investigators called "Nexus" — a command-center web application that helps investigators map relationships between people, organizations, locations, vehicles, and events across cases, surfaces key influential individuals in a network, and flags suspicious patterns for review.

Vibe: serious, trustworthy, calm, data-dense but clearly organized — like a professional analytics/intelligence tool, not a consumer app. Deep charcoal-navy background, cyan-teal accent color, clean modern sans-serif typography, monospace font for IDs and case numbers. Rounded 8-12px corners on cards, subtle borders instead of heavy shadows, a left-hand persistent navigation rail.

The core screens are: a secure login, a dashboard/command center home, an interactive network graph explorer, an entity profile view, a case workspace, a search and query screen, an alerts/pattern-detection feed, and a report export screen.

Start by designing the Dashboard / Command Center home screen.
```

---

## Prompt 1 — Dashboard / Command Center (home screen)

```
Design the Dashboard home screen for "Nexus," the intelligence analysis platform described above (deep charcoal-navy background, cyan-teal accent, rounded 8-12px cards, subtle borders, Inter/IBM Plex Sans font, monospace for IDs, left-hand persistent navigation rail with icons for Dashboard, Network Explorer, Cases, Search, Alerts, Reports).

Layout:
- Left navigation rail (icons: Dashboard, Network Explorer, Cases, Search, Alerts, Reports, Admin at the bottom) with the logged-in officer's name and rank at the very bottom.
- Top header bar with a global search input and a notification bell icon showing an unread alert count badge.
- Main content area with a 4-column row of KPI summary cards at the top: "Active Cases," "Entities Tracked," "Pending Review," "Open Alerts" — each with a large number and a small trend indicator.
- Below the KPI row, a two-column layout: left column is a "Recent Activity" feed (timestamped list of recent extractions, merges, and case updates, monospace timestamps), right column is a "Priority Alerts" card list showing the 3-5 highest-severity flagged patterns, each with a colored severity badge (red/amber), a one-line plain-language description, and a "Review" button.
- A "Quick Case Access" row of case cards at the bottom, each showing case ID (monospace), title, status badge, and number of linked entities.

Keep it data-dense but clearly grouped with card headers and consistent spacing. This is a screen an investigator checks first thing every day.
```

---

## Prompt 2 — Network Graph Explorer (the core screen)

```
Design the Network Graph Explorer screen for "Nexus" (same design system: deep charcoal-navy background, cyan-teal accent, rounded cards, monospace for IDs, left navigation rail).

Layout:
- Left navigation rail, same as the dashboard.
- A left-side filter panel (collapsible) with: entity type checkboxes (Person, Organization, Location, Vehicle, Phone Number, Bank Account — each with a small colored dot matching its graph node color), a relationship-type filter, a date range picker, and a confidence-threshold slider.
- The main area is a large interactive node-link graph canvas taking up most of the screen, dark background, nodes color-coded by entity type (use a small legend in the corner: Person = cyan, Organization = purple, Location = green, Vehicle = orange, Phone Number = yellow, Bank Account = pink), edges as thin lines with thickness representing connection strength. A few nodes should appear visibly larger than others to represent higher centrality/influence score.
- A floating toolbar over the canvas with zoom controls, a "Run Analysis" button (dropdown: Key Influencers, Community Detection, Shortest Path), and an "Expand All" / "Collapse" toggle.
- A right-side detail panel that appears when a node is selected, showing: entity name, type badge, aliases, a small stat row (connections count, centrality score with a plain-language explanation like "connects 3 otherwise-separate groups"), and a scrollable list of its direct relationships with relationship type and confidence.
- A bottom timeline scrubber bar for filtering the graph by date range, with a play button to animate the network's growth over time.

This is the most important screen in the app — it should feel powerful and information-rich but never cluttered. Use whitespace and subtle panel borders to separate the canvas from the filter and detail panels.
```

---

## Prompt 3 — Entity Profile Page

```
Design the Entity Profile page for "Nexus" (same design system as previous screens).

Layout:
- Left navigation rail, same as before.
- A profile header card at the top: entity name in large text, a type badge (Person/Organization/etc.), known aliases as small chips, a risk indicator badge with color coding, and an "Open in Network Explorer" button.
- A tab bar below the header: Overview, Relationships, Timeline, Documents, Notes.
- Overview tab: a two-column layout — left column shows key details (DOB, known addresses, phone numbers, linked accounts — all monospace where applicable) in a clean definition-list style; right column shows a small embedded mini network graph preview showing this entity's immediate connections (1-hop).
- Relationships tab: a filterable, sortable table of every relationship this entity has — columns for Connected Entity, Relationship Type, Confidence (as a small progress bar or percentage), Source Document (as a clickable monospace document ID), Date.
- Timeline tab: a vertical timeline of dated events, communications, and transactions involving this entity, each as a card with an icon indicating type.
- Keep the same color-coding conventions established for entity types and severity/confidence indicators.
```

---

## Prompt 4 — Case Workspace

```
Design the Case Workspace screen for "Nexus" (same design system as previous screens).

Layout:
- Left navigation rail, same as before.
- A case header bar: case ID (monospace), case title, status badge (Open/Investigating/Chargesheet-Ready/Closed) shown as a colored pill, assigned officers as small avatar chips, and a "Generate Report" primary button (cyan-teal) in the top right.
- A left sidebar within the case listing: Linked Entities (with counts), Linked Documents, Insights/Alerts for this case, and Notes — each as a clickable section.
- Main content area defaults to a case summary: a compact embedded network graph of just this case's entities, a "Key Individuals" card highlighting the top 3 ranked entities with their centrality explanation, and a chronological activity/notes feed at the bottom where officers can add timestamped, attributed notes.
- Use card-based grouping throughout, consistent with the dashboard screen, and the same severity/confidence color conventions.
```

---

## Prompt 5 — Search & Natural-Language Query

```
Design the Search screen for "Nexus" (same design system as previous screens).

Layout:
- Left navigation rail, same as before.
- A large, prominent search input at the top of the main area with placeholder text: "Search a name, phone number, case ID, or ask a question — e.g. 'everyone connected to Rizwan Khan within 2 hops who transacted over ₹1,00,000 in the last 6 months'"
- Below the search bar, a row of filter chips for narrowing by entity type, case, and date range.
- Search results shown as a list of result cards, each showing entity type icon, name, a short context snippet with the matched term highlighted, and connected-case tags.
- When the query is a natural-language question rather than a simple lookup, show a distinct "Query Result" card above the list that restates the interpreted query in plain language and shows a small result-count summary, with an option to open the full result set directly in the Network Graph Explorer.
```

---

## Prompt 6 — Alerts & Pattern Detection Feed

```
Design the Alerts screen for "Nexus" (same design system as previous screens).

Layout:
- Left navigation rail, same as before.
- A top filter/tab row: All, Financial Patterns, Communication Patterns, Location Patterns, by severity (Critical/High/Medium/Low) shown as colored toggle chips (red/amber/yellow/green).
- A main list of alert cards, each showing: a colored severity badge, alert title in plain language (e.g., "Unusual transaction clustering across 4 accounts"), the case it's linked to, a one-line explanation of what triggered it, a timestamp, and two action buttons — "Review Evidence" and a small dropdown to mark it Confirmed / False Positive / Needs More Info.
- Selecting "Review Evidence" should be implied to open a side panel showing the specific records (transactions, calls, or locations) that triggered the alert, so the design should include a slide-in right-side detail panel state with a list of cited source records (monospace reference IDs) and a short AI-generated explanation clearly labeled as "AI-generated summary — verify against source records."
```

---

## Prompt 7 — Report / Export Screen

```
Design the Report Generation screen for "Nexus" (same design system as previous screens).

Layout:
- Left navigation rail, same as before.
- A left panel showing the selected case and a checklist of what to include in the report: Entity Profiles, Relationship Map (as an embedded static graph image), Timeline, Evidence Citations, Investigator Notes — each with a checkbox.
- A live preview pane on the right showing a formatted document preview (title page with case ID, then sectioned content matching the checked items), styled like a clean formal report rather than the app's dark theme — white/light background within the preview frame to simulate the printed output, while the surrounding app chrome stays in the dark theme.
- A bottom action bar with "Export as PDF," "Export as DOCX," and a small note: "Every fact in this report is cited to its source document."
```

---

## Iteration Playbook (for refining after the first pass)

- **One change per prompt.** Don't combine a layout change with a component change in the same message — Stitch tends to regenerate more than intended when prompts mix instruction types.
- **Reference elements precisely**, the way you'd talk to a designer: "the primary button in the case header," "the severity badge on alert cards," not "the button."
- **Use UI/UX vocabulary** — "navigation rail," "card layout," "call-to-action button," "data table," "filter chip" — Stitch responds better to these than vague descriptions.
- **Screenshot after every good result.** If a later prompt regenerates more than you wanted, you have a reference to prompt back toward.
- **Theme-wide changes** ("make the accent color a slightly deeper teal across all screens") work best as their own explicit prompt, applied consistently, rather than hoping it carries over automatically.
- Once all screens look right, use Stitch's **Figma export** or **HTML/CSS export** to hand off to your frontend implementation (React + TypeScript per file 02).
