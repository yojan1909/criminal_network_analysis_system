"""
Nexus Intelligence Command Center — FastAPI Server
Serves the static frontend and provides the REST API.
"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import time

from backend.database import init_database, log_audit
from backend.seed_data import seed_all
from backend.routes import (
    dashboard, entities, cases, network, alerts, search, reports,
    audit, live_feeds, nlp_pipeline, ai, documents
)
from backend.ai_service import ai_service

# Initialize
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app = FastAPI(
    title="Nexus Intelligence Command Center",
    description="Criminal intelligence network analysis platform",
    version="4.8.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Audit middleware
@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 1)

    # Log API calls (but not static file serving)
    if request.url.path.startswith("/api/"):
        log_audit(
            user_id="AN-89241",
            action=request.method,
            resource_type="api",
            resource_id=request.url.path,
            details=f"Response: {response.status_code}, Duration: {duration}ms"
        )

    return response


# Mount API routers
app.include_router(dashboard.router)
app.include_router(entities.router)
app.include_router(cases.router)
app.include_router(network.router)
app.include_router(alerts.router)
app.include_router(search.router)
app.include_router(reports.router)
app.include_router(audit.router)
app.include_router(live_feeds.router)
app.include_router(nlp_pipeline.router)
app.include_router(ai.router)
app.include_router(documents.router)

# Mount static assets
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")


# Serve HTML pages
@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/{page}.html")
async def serve_page(page: str):
    filepath = os.path.join(FRONTEND_DIR, f"{page}.html")
    if os.path.exists(filepath):
        return FileResponse(filepath)
    return JSONResponse({"error": "Page not found"}, status_code=404)


@app.on_event("startup")
async def startup_event():
    """Initialize database, seed data, and ingest real FBI fugitive dataset on startup."""
    print("\n" + "=" * 60)
    print("  NEXUS INTELLIGENCE COMMAND CENTER v4.8")
    print("  Starting server...")
    print("=" * 60)
    init_database()
    seed_all()
    print("  ✓ Database initialized")
    try:
        from backend.realtime_criminal_service import ingest_fbi_criminals_into_db
        ingest_fbi_criminals_into_db()
        print("  ✓ Real-world FBI Most Wanted dataset synchronized")
    except Exception as e:
        print(f"  ⚠ FBI dataset ingest note: {e}")
    print("  ✓ API endpoints ready")
    ai_stat = ai_service.get_status()
    print(f"  ✓ AI Engine: {ai_stat['active_provider'].upper()} ({ai_stat['active_model']})")
    print(f"  → Open http://localhost:8000 in your browser")
    print("=" * 60 + "\n")
