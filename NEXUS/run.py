#!/usr/bin/env python3
"""
Nexus Intelligence Command Center — One-Command Launcher
Installs dependencies, seeds the database, and starts the server.
"""

import subprocess
import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def check_and_install_deps():
    """Install Python dependencies if needed."""
    try:
        import fastapi
        import uvicorn
        import networkx
        print("[NEXUS] Dependencies already installed.")
    except ImportError:
        print("[NEXUS] Installing dependencies...")
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-q",
            "-r", os.path.join(BASE_DIR, "requirements.txt")
        ])
        print("[NEXUS] ✓ Dependencies installed.")


def main():
    check_and_install_deps()

    # Import after ensuring deps are installed
    import uvicorn

    print("\n" + "=" * 60)
    print("  NEXUS INTELLIGENCE COMMAND CENTER")
    print("  Starting on http://localhost:8000")
    print("=" * 60 + "\n")

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info",
    )


if __name__ == "__main__":
    main()
