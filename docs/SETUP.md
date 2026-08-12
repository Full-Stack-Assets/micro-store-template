# Setup

This walkthrough activates the hourly storefront workflow and its optional
Evolution Engine integration.

## Prerequisites

- Commit access to `Full-Stack-Assets/micro-store-template`.
- GitHub CLI authenticated with access to the repository.
- GitHub Pages configured with **Source: GitHub Actions**.
- Optional: a reachable Evolution Engine exposing:
  - `GET {base}/brand`
  - `POST {base}/deployments`

```bash
gh auth login
gh auth status
```

## Repository secrets

Only engine-backed brand generation requires secrets. Manual dispatch and
`repository_dispatch` payloads can publish without them.

### `EVOLUTION_ENGINE_URL`

Set the base URL without a trailing slash:

```bash
gh secret set EVOLUTION_ENGINE_URL \
  --repo Full-Stack-Assets/micro-store-template
```

### `EVOLUTION_ENGINE_TOKEN`

Set the bearer token accepted by both engine endpoints:

```bash
gh secret set EVOLUTION_ENGINE_TOKEN \
  --repo Full-Stack-Assets/micro-store-template
```

Check the configured names:

```bash
gh secret list --repo Full-Stack-Assets/micro-store-template
```

## Smoke test

Run the workflow with inline brand data:

```bash
gh workflow run hourly-store.yml \
  --repo Full-Stack-Assets/micro-store-template \
  -f brand_data='{"brandName":"Smoke Test","tagline":"Hello","colorPalette":{"primary":"#0f172a","secondary":"#f97316"}}'

gh run watch --repo Full-Stack-Assets/micro-store-template
```

The successful run summary contains the Pages URL. Open it and confirm that
the smoke-test brand renders.

## Engine-driven test

After setting both secrets:

```bash
gh workflow run hourly-store.yml \
  --repo Full-Stack-Assets/micro-store-template

gh run watch --repo Full-Stack-Assets/micro-store-template
```

The engine must return JSON conforming to
`schema/brand-data.schema.json`.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| No brand source is available | Supply `brand_data` or configure both engine secrets. |
| `404` on brand fetch | The base URL is wrong or `/brand` is unavailable. |
| `401` on engine calls | The bearer token does not match the engine configuration. |
| Schema validation fails | Inspect `brand.json` and compare it with the repository schema. |
| Pages deployment is skipped | Set Pages source to **GitHub Actions** in repository settings. |
| Cron stops firing | Re-enable the scheduled workflow after prolonged inactivity. |

Secret rotation uses the same `gh secret set` commands; the next run reads
the replacement values.
