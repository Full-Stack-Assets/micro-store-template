# Integration kit

Everything the **evolution-engine** (a.k.a. store generator) needs to
talk to this storefront. The repo is the consumer; the engine is the
producer. This directory is the contract.

## Contents

| File | What it is |
|---|---|
| [`openapi.yaml`](./openapi.yaml) | OpenAPI 3.1 spec for the two HTTP endpoints the engine must expose: `GET /brand` and `POST /deployments`. |
| [`dispatch.sh`](./dispatch.sh) | Reference implementation of triggering a build from the engine side via `repository_dispatch`. Bash + `gh` + `jq`. |
| [`../schema/brand-data.schema.json`](../schema/brand-data.schema.json) | JSON Schema for the `BrandData` payload — single source of truth. The OpenAPI spec mirrors it. |
| [`../types/brand.ts`](../types/brand.ts) | TypeScript interface for storefront consumers. |

## Two integration modes

The storefront's `hourly-store` workflow supports both. Pick whichever
matches the engine's posture:

### Mode A — Pull (default)

The workflow's hourly cron tick calls `GET {EVOLUTION_ENGINE_URL}/brand`
on the engine. The engine returns a fresh `BrandData` payload. Workflow
validates → builds → deploys → calls `POST {EVOLUTION_ENGINE_URL}/deployments`
with the preview URL.

The engine just needs the two endpoints from `openapi.yaml`. The cron
lives in GitHub Actions.

### Mode B — Push

The engine owns scheduling. When it wants a new store, it POSTs a
`repository_dispatch` event to this repo with the brand data inline:

```bash
./integration/dispatch.sh path/to/brand.json
# or
echo "$BRAND_JSON" | ./integration/dispatch.sh -
```

The workflow short-circuits the `/brand` fetch and uses
`client_payload.brand_data` directly. Engine still receives the
`POST /deployments` callback afterward.

Use Mode B when:
- The engine has its own scheduler and doesn't want hourly fixed cadence.
- The engine wants to drive ad-hoc builds (manual generations, replays).
- The engine isn't reachable from GitHub-hosted runners.

## Consuming the schema from the engine

The engine should validate its own output against
`../schema/brand-data.schema.json` before responding to `GET /brand` or
before dispatching. Pull it via raw URL:

```bash
curl -fsSL https://raw.githubusercontent.com/Full-Stack-Assets/micro-store-template/main/schema/brand-data.schema.json \
  -o brand-data.schema.json
```

Or, if the engine is TypeScript, copy `../types/brand.ts` directly —
it's three small interfaces with no dependencies.

## Verifying the contract

```bash
# OpenAPI parses:
npx --yes @redocly/cli@latest lint integration/openapi.yaml

# JSON Schema parses + matches OpenAPI BrandData:
npx ajv-cli@5 compile -s schema/brand-data.schema.json

# Dispatch round-trip (requires repo secrets set):
./integration/dispatch.sh - <<'EOF'
{"brandName":"Smoke","tagline":"hi","colorPalette":{"primary":"#0f172a","secondary":"#f97316"}}
EOF
gh run watch --repo Full-Stack-Assets/micro-store-template
```

## Versioning

The contract is `1.0.0` (see `openapi.yaml`). Breaking changes to
`BrandData` or the endpoint shapes bump the major version and require
a coordinated PR on the engine side. Additive optional fields are minor
bumps and safe to ship unilaterally.
