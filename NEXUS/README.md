# Nexus Intelligence Command Center

A professional, data-dense web-based intelligence analysis platform for law enforcement and digital forensics investigators, exported directly from Google Stitch designs.

---

## Quick Start (Access Anytime)

### Method 1: Double-Click from Finder (Easiest on macOS)
Just double-click **`launch.command`** in this folder. It will start the local server and automatically open your default browser to the Dashboard.

### Method 2: Terminal Script
Run:
```bash
./start.sh
```
Or specify a custom port:
```bash
./start.sh 3000
```

### Method 3: Direct File Open
You can also directly double-click **`index.html`** to open it in Chrome, Safari, Edge, or Firefox. All assets and navigation use relative paths and localized images.

### Method 4: Deploy to Static Hosting (GitHub Pages / Vercel / Netlify)
Because this is a completely static, self-contained frontend:
- **Vercel / Netlify**: Drag-and-drop this folder or connect the Git repository.
- **GitHub Pages**: Push this directory to a repo and set GitHub Pages source to `/root`.

---

## Screen Directory & File Map

| Screen | File | Description |
|---|---|---|
| **Command Center (Daily Briefing)** | [`index.html`](file://index.html) | Primary operational dashboard with KPI row (Active Cases, Tracked Entities, Pending Review, Open Alerts), live UTC tactical clock, recent activity timeline, priority alerts, and quick-access case cards. |
| **Executive Analytics Console** | [`command-center-exec.html`](file://command-center-exec.html) | High-level telemetry console with strategic threat metrics and multi-case analytics. |
| **Network Graph Explorer** | [`network-explorer.html`](file://network-explorer.html) | Interactive SVG node-link graph with glow filters, zoom/pan controls, entity type filter checkboxes, timeline scrubber, and dynamic right drawer for entity inspection. |
| **Entity Profile Dossier** | [`entity-profiles.html`](file://entity-profiles.html) | Target dossier for Dmitri Petrov (`POI-9042`), risk telemetry, INTERPOL notice, interactive tabs (Overview, Relationships, Timeline, Documents, Notes), and embedded 1-hop tactical subgraph. |
| **Case Workspace** | [`case-workspaces.html`](file://case-workspaces.html) | Case workspace for Operation Blackthorn (`CS-2024-8841`), assigned officer chips, case topology graph, key individual ranking cards, and *Generate Report* button. |
| **Alerts & Pattern Intelligence** | [`alerts-patterns.html`](file://alerts-patterns.html) | Multi-criteria threat queue with severity filters (Critical, High, Medium, Low), category tabs, and sticky Evidence Dossier drawer with AI-summary verification notice. |
| **Cross-Case Search** | [`cross-case-search.html`](file://cross-case-search.html) | Natural language query search engine with query interpreter card (seed node, 2-hop depth, financial threshold, temporal scope), and structured entity cards. |
| **Evidentiary Report Generator** | [`report-generator.html`](file://report-generator.html) | Formal report generator for `CS-2024-8841`, interactive section checklist, formal printed preview sheet, and one-click PDF export via browser print. |

---

## Assets & Structure

```
criminal_tracker/
├── index.html                   # Daily investigator dashboard
├── command-center-exec.html     # Executive command console
├── network-explorer.html        # Interactive network graph explorer
├── entity-profiles.html         # Target POI dossier
├── case-workspaces.html         # Case workspace
├── alerts-patterns.html         # Alerts & pattern feed with evidence review
├── cross-case-search.html       # NL query & federated search
├── report-generator.html        # Intelligence dossier report generator
├── launch.command               # Double-clickable macOS launcher
├── start.sh                     # Terminal startup script
├── assets/
│   ├── images/
│   │   ├── mark.svg             # Official tactical intelligence mark
│   │   ├── analyst-vance.png    # Analyst headshot portrait
│   │   └── img_*.jpg            # Localized suspect & entity photos
│   ├── css/
│   │   └── nexus-shared.css     # Shared tactical styling, scrollbars, glowing animations
│   └── js/
│       ├── nexus-core.js        # Live UTC clock, hotkeys (/ and Ctrl+K), tabs, tactical toasts
│       └── nexus-graph.js       # Interactive graph node selection, zoom/pan, filter controls
├── nexus-command-center-export.zip # Standalone zip archive for backup/distribution
└── 00-08 markdown files         # Original system architecture & specification suite
```

---

## Future Backend Integration Notes

When ready to connect your backend services (FastAPI / Node / Spring Boot + Neo4j / PostgreSQL / OpenSearch):
1. **Graph Explorer**: Wire `assets/js/nexus-graph.js` to fetch live Cytoscape / vis-network or Neo4j JSON from `GET /api/v1/cases/{case_id}/graph`.
2. **Search**: Wire `cross-case-search.html` search input to `POST /api/v1/search/query` (which invokes your LLM + OpenSearch retriever).
3. **Alerts**: Wire `alerts-patterns.html` to `GET /api/v1/alerts` and WebSocket stream for real-time threat pings.
4. **Case Workspace & Dossiers**: Wire `GET /api/v1/cases/{id}` and `GET /api/v1/entities/{id}` to hydrate the cards and tables.
