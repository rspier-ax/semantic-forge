#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Building domain packages..."
npm run build:packages

echo "Deploying SQLite database..."
npx cds deploy --to sqlite

echo "Starting CAP (port 4004)..."
npx cds watch --port 4004 &
CAP_PID=$!

cleanup() {
  kill "$CAP_PID" 2>/dev/null || true
}
trap cleanup EXIT

sleep 5

echo "Starting OpenUI5 (port 8081)..."
npm run start --workspace=@semantic-forge/ui5 &
UI5_PID=$!
trap 'cleanup; kill "$UI5_PID" 2>/dev/null || true' EXIT

echo ""
echo "SemanticForge dev environment"
echo "  CAP OData: http://localhost:4004/odata/v4/model/"
echo "  UI5 app:   http://localhost:8081/index.html"
echo ""
echo "Press Ctrl+C to stop."

wait
