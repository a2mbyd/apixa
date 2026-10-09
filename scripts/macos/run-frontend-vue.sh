#!/usr/bin/env bash
# Start the Vue example (macOS).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec "$HERE/../lib/run-frontend.sh" "@apixa/example-vue" "Vue" "http://localhost:5174" "dev"
