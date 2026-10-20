# Chernyakov Coaching — website

Website for Michael Chernyakov's coaching practice. A pnpm TypeScript monorepo, deployed as a single Cloudflare Worker:

- **`apps/web`**: React 19 + React Router (framework mode, every page prerendered to static HTML) + Vite + Tailwind CSS v4 + shadcn/ui.
- **`apps/api`**: Hono API on Cloudflare Workers. It serves the prerendered web build as static assets and handles `/api/*`.
- **`packages/shared`**: zod schemas and the resource catalog, used by both apps.

Docs:
- Architecture before the migration: `docs/old_architecture.md`
- The migration plan: `docs/new_architecture_plan.md`
- Manual setup steps (accounts, secrets, DNS): `TODO.md`

## Requirements

- Node 24 (`.nvmrc`)
- pnpm 11 (`corepack enable` picks up the version pinned in `package.json`)

## Getting started

```bash
pnpm install
pnpm dev            # frontend + backend together
```

The first run creates `apps/api/.env` and `apps/web/.env` from their `.env.example` templates. Both are git-ignored. You can also run that step on its own with `pnpm env:init`. The defaults work without any accounts:
- Turnstile uses Cloudflare's test keys.
- MailerLite runs in dry-run mode: a download signup logs the subscriber payload in the backend terminal instead of calling MailerLite.

| Command | Starts |
|---------|--------|
| `pnpm dev` | Both of the below, in parallel |
| `pnpm dev:frontend` | Vite dev server (hot reload) at http://localhost:5180 |
| `pnpm dev:backend` | The Worker (`wrangler dev`) at http://localhost:8787 |
| `pnpm preview` | Production-like: builds the site, then the Worker serves pages + API at http://localhost:8787 |

### Environment files

| File | Variable | Purpose |
|------|----------|---------|
| `apps/web/.env` | `BACKEND_URL` | Where the frontend sends `/api/*`. The browser calls the dev server, which forwards to this URL, so it can be the local Worker (default `http://localhost:8787`) or a deployed one, with no CORS setup. Only used by the dev server: in production the Worker serves pages and API from the same origin. |
| `apps/web/.env` | `VITE_TURNSTILE_SITE_KEY` | Public Turnstile site key. Empty = Cloudflare test key. |
| shell, set by `pnpm deploy` / CI deploy | `REQUIRE_TURNSTILE_SITE_KEY=true` | Makes the build fail if `VITE_TURNSTILE_SITE_KEY` is empty or a test key. Not needed locally. |
| `apps/api/.env` | `MAILERLITE_DRY_RUN` | `true` = skip MailerLite and log the link. Local only. |
| `apps/api/.env` | `MAILERLITE_API_TOKEN`, `MAILERLITE_RESOURCE_GROUP_IDS` (JSON: slug → group id), `MAILERLITE_OFFERS_GROUP_ID` | Needed when dry run is off. Use test groups. |
| `apps/api/.env` | `TURNSTILE_SECRET_KEY`, `DOWNLOAD_TOKEN_SECRET`, `DOWNLOAD_LINK_TTL_HOURS` | Bot check secret, link signing secret, link lifetime in hours (required, > 0) |

Shell variables override the files, for example `BACKEND_URL=https://….workers.dev pnpm dev:frontend`.

Note: if an `apps/api/.dev.vars` file exists, wrangler reads it **instead of** `.env`. Delete it to use `.env`.

Production values are not set in these files. Secrets go in with `wrangler secret put` and plain variables live in `wrangler.jsonc` (see `DEPLOY.md`).

### Local downloads

Every resource is downloaded from a private R2 bucket, so seed the local bucket once:

```bash
pnpm r2:seed
```

Then open http://localhost:5180/resources/, pick a resource and enter any email: the download starts. In dry-run mode the backend terminal shows what would have been sent to MailerLite.

## Scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` / `dev:frontend` / `dev:backend` | Local dev servers (see above) |
| `pnpm env:init` | Create missing `apps/*/.env` from `.env.example` |
| `pnpm r2:seed` | Upload the PDFs to the local R2 bucket (`--remote` for Cloudflare) |
| `pnpm build` | Prerender the web app into `apps/web/build/client` |
| `pnpm typecheck` | React Router typegen, then `tsc` in every package |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |
| `pnpm test` | API + shared unit tests (Vitest) and the prerender check (run after `pnpm build`) |
| `pnpm preview` | Build, then run the real Worker locally |
| `pnpm deploy` | Build, then `wrangler deploy` (needs a Cloudflare login, see `DEPLOY.md`) |

## Layout

```
apps/web/app/
  root.tsx               <html>/<head>, header, footer, Umami, React Query provider
  routes.ts              URL → route module (mirrors the old site's URLs)
  routes/*.tsx           one module per page, each with its own meta()
  components/layout/     SiteHeader (transparent on home), SiteFooter
  components/sections/   AutoplayVideo
  components/ui/         shadcn/ui components (button, input, label, checkbox)
  features/signup/       SignupForm (react-hook-form + zod + Turnstile + React Query)
  lib/site.ts            contact email, booking links, Umami id, Turnstile site key
  styles/site.css        the original site's stylesheet (Tailwind base layer)
apps/web/public/         images, videos, free PDFs, robots.txt, sitemap.xml, _redirects, _headers
apps/api/src/
  index.ts               Hono app under /api, asset fallthrough
  routes/                health, signup, downloads
  services/              mailerlite, turnstile, tokens (HMAC-signed download links)
apps/api/wrangler.jsonc  Worker config: assets, R2 bucket, rate limiter, vars
```

## Editing tips

- **Page copy:** edit `apps/web/app/routes/<page>.tsx`.
- **Title, description and social tags:** edit the `meta()` export in the same file.
- **Booking links, email, analytics id:** edit `apps/web/app/lib/site.ts`.
- **Colours and fonts:** edit the variables on `:root` at the top of `apps/web/app/styles/site.css`. Tailwind and shadcn read them via `@theme` in `apps/web/app/app.css`.
- **Adding a page:**
  1. Add the module in `routes/`.
  2. Register it in `routes.ts`.
  3. Add its path to `PRERENDER_PATHS` in `apps/web/react-router.config.ts` and to `public/sitemap.xml`.
- **Adding a shadcn component:** `cd apps/web && pnpm dlx shadcn@latest add <name>` (uses `apps/web/components.json`).
