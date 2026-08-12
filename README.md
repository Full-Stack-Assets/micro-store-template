# Micro Store Template

A stateless Next.js storefront rendered from one validated JSON payload and
designed as the frontend half of the **Evolution Engine** ecosystem. The
hourly workflow can fetch fresh brand data, build a static export, publish it
with GitHub Pages, and report the resulting URL back to the engine.

## Features

- Next.js 15 and React 19
- Tailwind CSS
- TypeScript
- Responsive storefront layout
- Schema-validated brand data
- Static export suitable for any static host
- Scheduled and engine-triggered publishing

## Integration contract

The storefront reads `NEXT_PUBLIC_BRAND_DATA`, a JSON string matching
[`BrandData`](./types/brand.ts) and
[`schema/brand-data.schema.json`](./schema/brand-data.schema.json).

```json
{
  "brandName": "Driftwood Coffee",
  "tagline": "Brewed slow, poured bold.",
  "logoUrl": "https://example.com/logo.png",
  "heroImageUrl": "https://example.com/hero.png",
  "colorPalette": {
    "primary": "#0f172a",
    "secondary": "#f97316"
  }
}
```

Required fields are `brandName`, `tagline`, `colorPalette.primary`, and
`colorPalette.secondary`. `logoUrl` and `heroImageUrl` are optional.

## Local development

```bash
npm ci
NEXT_PUBLIC_BRAND_DATA='{"brandName":"Test","tagline":"Hello","colorPalette":{"primary":"#ffffff","secondary":"#000000"}}' \
  npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run dev
npm run build
npm start
```

## Hourly automation

`.github/workflows/hourly-store.yml` supports:

- an hourly cron;
- manual dispatch with an optional `brand_data` JSON override; and
- `repository_dispatch` with event type `engine-tick`.

Each run resolves brand data, validates it against the schema, builds the
static site, publishes the `out/` artifact with GitHub Pages, and reports the
published URL to the engine's `/deployments` endpoint.

### Required repository secrets

| Secret | Purpose |
|---|---|
| `EVOLUTION_ENGINE_URL` | Base URL for `GET /brand` and `POST /deployments`. |
| `EVOLUTION_ENGINE_TOKEN` | Bearer token for both engine calls. |

Manual and payload-driven runs do not need the engine URL to resolve brand
data. The deployment callback is skipped when the URL is unavailable.

See [docs/SETUP.md](./docs/SETUP.md) for repository configuration and
[DEPLOYMENT.md](./DEPLOYMENT.md) for publishing details.
