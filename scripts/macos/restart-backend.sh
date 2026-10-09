#!/usr/bin/env bash
# Restart the Apixa FastAPI backend (macOS).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"

"$HERE/stop-backend.sh" || true
exec "$HERE/run-backend.sh"
