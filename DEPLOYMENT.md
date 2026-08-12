# Deployment Guide

The storefront is configured as a static Next.js export. The repository's
hourly workflow builds `out/` and publishes that artifact with GitHub Pages.
The same output directory can also be served by any standards-compliant
static host.

## Prerequisites

1. Repository access with permission to manage Actions and Pages.
2. A valid `NEXT_PUBLIC_BRAND_DATA` JSON payload.
3. Optional Evolution Engine credentials for automated brand retrieval and
   deployment callbacks.

## Enable GitHub Pages

1. Open the repository **Settings**.
2. Select **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Open **Actions** and run **Hourly store generation** manually with a
   `brand_data` payload for the first smoke test.

The workflow uses the repository name as the production base path and
publishes the generated `out/` directory.

## Build locally

```bash
npm ci
NEXT_PUBLIC_BRAND_DATA='{"brandName":"Test","tagline":"Hello","colorPalette":{"primary":"#ffffff","secondary":"#000000"}}' \
  npm run build
```

Serve the exported site locally:

```bash
npx --yes serve out
```

## Environment variable format

`NEXT_PUBLIC_BRAND_DATA` must be a JSON string with this shape:

```json
{
  "brandName": "Your Brand Name",
  "tagline": "Your brand tagline",
  "logoUrl": "https://example.com/logo.png",
  "heroImageUrl": "https://example.com/hero.jpg",
  "colorPalette": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF"
  }
}
```

## Automated publishing

The workflow accepts brand data in this order:

1. `workflow_dispatch.inputs.brand_data`;
2. `repository_dispatch.client_payload.brand_data`; or
3. `GET {EVOLUTION_ENGINE_URL}/brand`.

The first two paths let maintainers test publishing without engine
credentials. The engine-backed path requires both repository secrets
documented in `docs/SETUP.md`.

After a successful Pages deployment, the workflow sends this payload to
`POST {EVOLUTION_ENGINE_URL}/deployments` when the engine URL is configured:

```json
{
  "url": "https://full-stack-assets.github.io/micro-store-template/",
  "sha": "<commit sha>",
  "run_id": "<workflow run id>",
  "ran_at": "<ISO-8601 timestamp>"
}
```

## Troubleshooting

### Brand resolution fails

Provide `brand_data` in a manual run or configure both engine secrets. The
workflow emits a precise error when no brand source is available.

### Schema validation fails

Download the `brand.json` artifact from the failed run and compare it with
`schema/brand-data.schema.json`.

### Static assets return 404

Confirm Pages is using **GitHub Actions** and that `next.config.js` derives
the base path from `GITHUB_REPOSITORY` during CI builds.

### Scheduled runs stop

GitHub may disable schedules after prolonged repository inactivity. Re-enable
the workflow from the Actions tab or push a repository change.
