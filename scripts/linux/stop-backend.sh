#!/usr/bin/env bash
# Stop the Apixa FastAPI backend (Linux).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BACKEND="$ROOT/backend"
PORT="${APIXA_BACKEND_PORT:-8787}"
PID_FILE="$BACKEND/.backend.pid"

stopped=0

if [[ -f "$PID_FILE" ]]; then
  pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${pid}" ]] && kill -0 "$pid" 2>/dev/null; then
    echo "Stopping backend pid ${pid} …"
    kill "$pid" 2>/dev/null || true
    sleep 0.5
    if kill -0 "$pid" 2>/dev/null; then
      kill -9 "$pid" 2>/dev/null || true
    fi
    stopped=1
  fi
  rm -f "$PID_FILE"
fi

# Prefer lsof; fall back to fuser/ss on minimal Linux images.
pids=""
if command -v lsof >/dev/null 2>&1; then
  pids="$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null || true)"
elif command -v fuser >/dev/null 2>&1; then
  pids="$(fuser "${PORT}/tcp" 2>/dev/null || true)"
elif command -v ss >/dev/null 2>&1; then
  pids="$(ss -lptn "sport = :${PORT}" 2>/dev/null | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | sort -u || true)"
fi

if [[ -n "${pids}" ]]; then
  echo "Stopping process(es) listening on port ${PORT}: ${pids}"
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null || true
  sleep 0.5
  # shellcheck disable=SC2086
  kill -9 $pids 2>/dev/null || true
  stopped=1
fi

if [[ "$stopped" -eq 1 ]]; then
  echo "Backend stopped."
else
  echo "Backend is not running (nothing on port ${PORT})."
fi
