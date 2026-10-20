"""
Vercel Serverless Entry Point for Nexus Intelligence Command Center
Adapts the FastAPI app for Vercel's Python runtime.
"""

import os
import sys

# Project root is one level up from api/
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

# Use /tmp for SQLite database (only writable path on Vercel serverless)
os.environ["DB_PATH"] = "/tmp/nexus.db"

# Ensure CWD is project root so relative paths in server.py work
os.chdir(PROJECT_ROOT)

from server import app  # noqa: E402
