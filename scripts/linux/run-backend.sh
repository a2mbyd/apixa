#!/usr/bin/env bash
# Start the Apixa FastAPI backend for local development (Linux).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BACKEND="$ROOT/backend"
HOST="${APIXA_BACKEND_HOST:-127.0.0.1}"
PORT="${APIXA_BACKEND_PORT:-8787}"
PID_FILE="$BACKEND/.backend.pid"
HERE="$(cd "$(dirname "$0")" && pwd)"

cd "$BACKEND"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required but was not found." >&2
  exit 1
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${old_pid}" ]] && kill -0 "$old_pid" 2>/dev/null; then
    echo "Backend already running (pid ${old_pid}). Stop it first: ${HERE}/stop-backend.sh" >&2
    exit 1
  fi
  rm -f "$PID_FILE"
fi

if [[ ! -d .venv ]]; then
  echo "Creating virtualenv at backend/.venv …"
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

python -m pip install --upgrade pip >/dev/null
python -m pip install -r requirements.txt

cleanup() {
  rm -f "$PID_FILE"
}
trap cleanup EXIT INT TERM

echo "Apixa backend → http://${HOST}:${PORT}"
echo "API docs      → http://${HOST}:${PORT}/docs"

python -m uvicorn app.main:app --host "$HOST" --port "$PORT" --reload &
PID=$!
echo "$PID" > "$PID_FILE"
wait "$PID"
