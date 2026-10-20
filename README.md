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
cp apps/api/.dev.vars.example apps/api/.dev.vars   # fill in local test values (git-ignored)
pnpm dev
```

`pnpm dev` runs two servers:
- **Vite** at http://localhost:5180: the web app, with hot reload.
- **`wrangler dev`** at http://localhost:8787: the Worker. Vite forwards `/api/*` requests to it.

To test the production setup locally (the prerendered build served by the Worker, exactly as on Cloudflare):

```bash
pnpm preview   # builds, then http://localhost:8787
```

The gated download reads from a local R2 bucket. Seed it once:

```bash
git show main:downloads/Unstuck_Question_Toolkit_Worksheet.pdf > /tmp/unstuck.pdf
pnpm --filter @coaching/api exec wrangler r2 object put coaching-downloads/unstuck.pdf \
  --file /tmp/unstuck.pdf --content-type application/pdf --local
```

## Scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Web (Vite) and API (wrangler) together |
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
