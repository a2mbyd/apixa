#!/usr/bin/env bash
# Start the Vanilla example (macOS).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec "$HERE/../lib/run-frontend.sh" "@apixa/example-vanilla" "Vanilla" "http://localhost:5175" "dev"
