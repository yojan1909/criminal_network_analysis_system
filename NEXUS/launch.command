#!/usr/bin/env bash
# ==============================================================================
# Nexus Intelligence Command Center - One-Click Launcher (macOS)
# Double-click this file from Finder to open the application in your browser.
# ==============================================================================

cd "$(dirname "$0")"

PORT=8080

# Check if server is already running on PORT
if ! lsof -i :$PORT >/dev/null 2>&1; then
  echo "Starting Nexus Tactical Command Server on http://localhost:$PORT..."
  python3 -m http.server $PORT &
  SERVER_PID=$!
  sleep 1
else
  echo "Nexus Tactical Command Server already running on port $PORT."
fi

# Open in default browser
open "http://localhost:$PORT/index.html"

echo "======================================================================"
echo "Nexus Intelligence Command Center is live!"
echo "URL: http://localhost:$PORT/index.html"
echo "Press Ctrl+C in this terminal window to stop the server when finished."
echo "======================================================================"

# Wait for background server if we launched it
if [ ! -z "$SERVER_PID" ]; then
  wait $SERVER_PID
fi
