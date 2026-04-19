# Setup

This walkthrough gets the hourly-store workflow from "inert" to "publishing
a new Vercel preview every hour." It assumes you already have commit access
to `Full-Stack-Assets/micro-store-template`.

## Prerequisites

- **GitHub CLI** (`gh`), authenticated:
  ```bash
  gh auth login
  gh auth status
  ```
- **Vercel account** with this repo imported as a project. If you haven't
  done that yet, run `npx vercel link` from the repo root and follow the
  prompts, or import it at <https://vercel.com/new>.
- **A running `evolution-engine`** reachable over HTTPS, exposing:
  - `GET  {base}/brand` — returns a `BrandData` JSON payload (see [`schema/brand-data.schema.json`](../schema/brand-data.schema.json)).
  - `POST {base}/deployments` — accepts `{url, sha, run_id, ran_at}`.

The workflow (`.github/workflows/hourly-store.yml`) calls both endpoints
with `Authorization: Bearer <EVOLUTION_ENGINE_TOKEN>`.

## The five secrets

Every `gh secret set` command below reads the value from stdin so it
never lands in your shell history.

### 1. `VERCEL_TOKEN`

Auth for the Vercel CLI (`vercel pull`, `vercel build`, `vercel deploy`).

1. Open <https://vercel.com/account/tokens>.
2. Click **Create Token**. Name it `micro-store-template hourly`. Scope
   it to the owning team/account. Expiration: whatever your policy
   allows (shorter is better; you'll rotate it).
3. Copy the token once — Vercel only shows it on creation.

```bash
gh secret set VERCEL_TOKEN --repo Full-Stack-Assets/micro-store-template
# paste the token, then Ctrl-D
```

### 2. `VERCEL_ORG_ID` and 3. `VERCEL_PROJECT_ID`

Both live in `.vercel/project.json` after you link the project locally:

```bash
npx vercel link --yes
cat .vercel/project.json
# { "orgId": "team_xxx...", "projectId": "prj_xxx..." }
```

`.vercel/` is gitignored, so this file stays local.

```bash
jq -r .orgId .vercel/project.json \
  | gh secret set VERCEL_ORG_ID --repo Full-Stack-Assets/micro-store-template

jq -r .projectId .vercel/project.json \
  | gh secret set VERCEL_PROJECT_ID --repo Full-Stack-Assets/micro-store-template
```

### 4. `EVOLUTION_ENGINE_URL`

Base URL of your running engine, **no trailing slash**. The workflow
appends `/brand` and `/deployments`.

```bash
gh secret set EVOLUTION_ENGINE_URL --repo Full-Stack-Assets/micro-store-template
# e.g. https://engine.example.com
```

### 5. `EVOLUTION_ENGINE_TOKEN`

Bearer token the engine accepts on both endpoints. Generate it from
whatever the engine provides (its admin UI, an auth CLI, a seeded
env var — lives in the engine's repo, not this one). The workflow
sends it as `Authorization: Bearer <token>` on every call.

```bash
gh secret set EVOLUTION_ENGINE_TOKEN --repo Full-Stack-Assets/micro-store-template
```

## Verify

```bash
gh secret list --repo Full-Stack-Assets/micro-store-template
```

All five names should appear. Then trigger a smoke test that bypasses
the engine fetch by passing brand data inline:

```bash
gh workflow run hourly-store.yml \
  --repo Full-Stack-Assets/micro-store-template \
  -f brand_data='{"brandName":"Smoke Test","tagline":"hello","colorPalette":{"primary":"#0f172a","secondary":"#f97316"}}'

gh run watch --repo Full-Stack-Assets/micro-store-template
```

A successful run logs `Preview: https://<project>-<hash>.vercel.app` in
the **Deploy preview** step. Open it — the storefront should render the
smoke-test brand.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `preflight` job fails with "Missing repo secrets" | One of the five names above isn't set, or was set to an empty value. Check `gh secret list` and re-set. |
| `Error: No existing credentials found` in the Vercel step | `VERCEL_TOKEN` is wrong or has been revoked. Create a new token and re-set the secret. |
| `404` on brand fetch | `EVOLUTION_ENGINE_URL` has a trailing slash, wrong host, or the `/brand` endpoint isn't implemented on the engine. |
| `401` on brand fetch or deployment report | `EVOLUTION_ENGINE_TOKEN` doesn't match what the engine expects. |
| `invalid_source_schema` from ajv step | Engine returned JSON that doesn't match [`schema/brand-data.schema.json`](../schema/brand-data.schema.json). Inspect the `brand.json` artifact in the failed run. |
| Cron stops firing | GitHub auto-disables scheduled workflows after 60 days with no repo activity. Push any commit or re-enable from the Actions tab. |

## Rotating secrets

Same command — `gh secret set <NAME>` overwrites. No workflow change
needed; the next run picks up the new value.
