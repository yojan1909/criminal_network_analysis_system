#!/usr/bin/env bash
# ==============================================================================
# Nexus Intelligence Command Center - Terminal Start Script
# Usage: ./start.sh [port]
# ==============================================================================

cd "$(dirname "$0")"

PORT=8000

echo "======================================================================"
echo "    NEXUS INTELLIGENCE COMMAND CENTER - LOCAL DEPLOYMENT"
echo "======================================================================"

if lsof -i :$PORT >/dev/null 2>&1; then
  echo "Backend server is already active on port $PORT."
else
  echo "Starting Nexus backend server on port $PORT..."
  python3 run.py &
  SERVER_PID=$!
  sleep 2
fi

URL="http://localhost:$PORT/index.html"
echo "Opening $URL in browser..."

if command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL"
fi

echo ""
echo "Console online: $URL"
echo "Press Ctrl+C to terminate session."
echo "======================================================================"

if [ ! -z "$SERVER_PID" ]; then
  wait $SERVER_PID
fi
