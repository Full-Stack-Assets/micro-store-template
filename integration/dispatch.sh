#!/usr/bin/env bash
#
# Trigger the hourly-store workflow with a brand payload, without going
# through the engine's GET /brand endpoint. Use this from the
# evolution-engine repo's CI, from a local terminal, or from any cron
# replacement.
#
# Requirements:
#   - `gh` authenticated against the storefront repo, OR
#   - `GH_TOKEN` env var with a token that has `repo` scope.
#
# Usage:
#   ./integration/dispatch.sh path/to/brand.json
#   ./integration/dispatch.sh - <<<'{"brandName":"Test", ... }'
#
# Behavior:
#   POSTs a `repository_dispatch` event of type `engine-tick` with the
#   given brand data in `client_payload.brand_data`. The workflow
#   (`.github/workflows/hourly-store.yml`) consumes it directly and
#   skips the engine fetch.

set -euo pipefail

REPO="${REPO:-Full-Stack-Assets/micro-store-template}"
EVENT_TYPE="${EVENT_TYPE:-engine-tick}"

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <brand.json | -> ; reads JSON from stdin if '-'" >&2
  exit 2
fi

if [ "$1" = "-" ]; then
  brand_json="$(cat)"
else
  brand_json="$(cat "$1")"
fi

# Validate it parses before sending.
if ! printf '%s' "$brand_json" | jq -e . >/dev/null; then
  echo "error: brand data is not valid JSON" >&2
  exit 1
fi

payload="$(jq -n --argjson brand "$brand_json" '{event_type: env.EVENT_TYPE, client_payload: {brand_data: $brand}}' EVENT_TYPE="$EVENT_TYPE")"

echo "→ dispatching $EVENT_TYPE to $REPO" >&2
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/dispatches" \
  --input - <<<"$payload"

echo "✓ dispatched. Watch the run:" >&2
echo "  gh run list --repo $REPO --workflow hourly-store.yml --limit 1" >&2
