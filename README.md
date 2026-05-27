# Micro Store Template

An auto-generated Next.js storefront rendered from a single JSON payload,
designed as the frontend half of the **Evolution Engine** ecosystem. Each
hour the workflow in this repo pulls fresh brand data from the engine and
publishes a new Vercel preview deployment — a new store every 60 minutes.

## Features

- ⚡ Built with Next.js 15 and React 19
- 🎨 Tailwind CSS for styling
- 🚀 Optimized for Vercel deployment
- 🔧 TypeScript support
- 📱 Responsive design
- 🎯 Dynamic brand data injection

## Usage

The Evolution Engine deploys this template to Vercel and injects brand data via the `NEXT_PUBLIC_BRAND_DATA` environment variable.

## Deployment

This template is optimized for deployment on **Vercel**, the recommended platform for Next.js applications.

**Quick Deploy:**
1. Push this repository to GitHub
2. Import to Vercel at [vercel.com/new](https://vercel.com/new)
3. Add `NEXT_PUBLIC_BRAND_DATA` environment variable
4. Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `NEXT_PUBLIC_BRAND_DATA`: JSON string containing brand information (name, tagline, colors, images)

Example:
```json
{
  "brandName": "My Store",
  "tagline": "Shop the best products",
  "logoUrl": "https://example.com/logo.png",
  "heroImageUrl": "https://example.com/hero.jpg",
  "colorPalette": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF"
  }
}
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
## Integration contract

The storefront is stateless. It reads one env var, `NEXT_PUBLIC_BRAND_DATA`,
whose value is a JSON string matching [`BrandData`](./types/brand.ts) / the
[JSON Schema](./schema/brand-data.schema.json):

```json
{
  "brandName": "Driftwood Coffee",
  "tagline": "Brewed slow, poured bold.",
  "logoUrl": "https://.../logo.png",
  "heroImageUrl": "https://.../hero.png",
  "colorPalette": { "primary": "#0f172a", "secondary": "#f97316" }
}
```

Required: `brandName`, `tagline`, `colorPalette.primary`, `colorPalette.secondary`.
Optional: `logoUrl`, `heroImageUrl` (the UI no-ops when missing).

## Hourly automation

`.github/workflows/hourly-store.yml` runs:

- **Cron:** every hour on the hour.
- **Manual:** `workflow_dispatch` with an optional `brand_data` input that
  overrides the engine fetch (useful for testing).
- **Engine-driven:** `repository_dispatch` (event type `engine-tick`) so
  the evolution-engine can push a payload directly — `client_payload.brand_data`
  replaces the fetch.

Each run: fetch → validate against `schema/brand-data.schema.json` → build →
`vercel deploy` (preview) → POST the resulting URL back to the engine's
`/deployments` endpoint.

### Required repo secrets

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Auth for `vercel pull/build/deploy`. |
| `VERCEL_ORG_ID` | Target Vercel scope. |
| `VERCEL_PROJECT_ID` | Target Vercel project. |
| `EVOLUTION_ENGINE_URL` | Base URL, e.g. `https://engine.example.com`. Workflow calls `GET {url}/brand` and `POST {url}/deployments`. |
| `EVOLUTION_ENGINE_TOKEN` | Bearer token for both calls. |

See [docs/SETUP.md](./docs/SETUP.md) for step-by-step provisioning.

## Local preview

```bash
npm ci
NEXT_PUBLIC_BRAND_DATA='{"brandName":"Test","tagline":"hi","colorPalette":{"primary":"#fff","secondary":"#000"}}' \
  npm run dev
```
