# Plan: static site → TypeScript React frontend + TypeScript API (pnpm, Cloudflare)

## Context

Today `chernyakov-coaching.com` is hand-written static HTML on GitHub Pages, with GoDaddy holding only the domain and DNS (see `docs/old_architecture.md`). The owner wants reactive components that call a backend API. The first two features:

1. **Signup proxy.** The `/guide/` form posts to MailerLite from the browser with `mode:'no-cors'`, so it always shows success and exposes the account and form ids. It should go through our API instead, which returns a real success or error.
2. **Gated downloads.** The "gated" worksheet is currently public under `/downloads/` and `/PDFs/`. PDFs should only be served through signed, expiring links handed out after signup.

The goal is the same pages, look and SEO, rebuilt as a pnpm TypeScript monorepo and hosted on the Cloudflare free tier. GoDaddy stays the domain registrar.

Work branch: `new_architecture_be_fe`.

Every manual step (accounts, tokens, dashboard settings, DNS) is tracked in `TODO.md` at the repo root. This plan covers the code work.

## Implementation status (branch `new_architecture_be_fe`)

| Phase | Status |
|-------|--------|
| 0. Prerequisites | 🚧 manual, see `TODO.md` |
| 1. Monorepo scaffold | ✅ pnpm workspace, TS strict, ESLint + Prettier, CI (`.github/workflows/ci.yml`) |
| 2. Frontend port | ✅ all 9 pages, same text/links/images as the old site (verified by diff), redirects, 404 |
| 3. API | ✅ `/api/health`, `/api/signup`, `/api/downloads/:slug`; 21 unit tests |
| 4. Reactive signup | ✅ `SignupForm` with real success/error states |
| 5. Gated assets + cleanup | ✅ code side; R2 upload is manual (`TODO.md` §3). Old static files deleted |
| 6. Preview deploy | 🚧 blocked on Cloudflare account; verified locally with `wrangler dev` |
| 7. Cutover | 🚧 code side done (privacy policy, docs, `routes` stub); DNS steps manual |

### Deviations from the plan below (decided during implementation)

- **Versions resolved newer than planned:** React Router **v8** (same framework mode as v7, minus removed flags), Vite 8, Vitest 5, zod 4. TypeScript is pinned to **6.0**: TS 7 is out, but typescript-eslint does not support it yet.
- **Styling:**
  - The original `styles.css` is kept as `apps/web/app/styles/site.css` in Tailwind's `base` layer.
  - Tailwind's preflight reset is not loaded, so the pages look exactly as before.
  - Tailwind utilities and shadcn/ui are available for new UI and are used in the signup form.
  - Rewriting all existing CSS into utilities was skipped: it was pure churn with a high risk of visual regressions.
- **Typed client:** plain `fetch` validated with the shared zod schemas (`apps/web/app/lib/api.ts`), instead of the Hono RPC client. Hono RPC would have required the web app to type-check the Worker's runtime types.
- **Header and nav:** ported as React components on the existing CSS, instead of shadcn `DropdownMenu` and `Sheet`, to keep the look identical.
- **Not added yet:** Motion, sonner and Playwright. They're not needed by anything built so far; add them when a feature needs them.
- **Gated download link:** MailerLite stores the full `download_url` instead of a bare token, so the email template doesn't need to know the URL format.
- **Signup rate limit:** a Workers rate-limiting binding (`SIGNUP_RATE_LIMITER`, 5 requests/min per IP) runs in front of Turnstile.

## Hosting decision: Cloudflare

| Role | Provider |
|------|----------|
| Domain registrar | GoDaddy (unchanged; renewals stay there) |
| DNS | Cloudflare (nameservers move from GoDaddy to Cloudflare) |
| Frontend + API hosting | Cloudflare Workers (free plan): one Worker serves the static assets and the Hono API |
| Gated file storage | Cloudflare R2 (free tier, private bucket) |
| Bot protection | Cloudflare Turnstile (free) |
| Email | Unchanged: Google Workspace (inbox) + MailerLite (newsletter sending) |
| Analytics | Unchanged: Umami Cloud |

GitHub Pages is switched off at cutover. GoDaddy hosting products (Node.js Hosting, VPS) are not used. Because the API is written in Hono, which also runs on plain Node (`@hono/node-server`), a later move off Cloudflare stays possible.

### Secrets handling

Secrets are never committed.

| Where | What |
|-------|------|
| Production | `wrangler secret put <NAME>`: stored encrypted in Cloudflare |
| Local dev | `apps/api/.dev.vars`: git-ignored; `.dev.vars.example` lists the names only |
| CI deploy | GitHub repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, used by `cloudflare/wrangler-action` |

Secret names:
- `MAILERLITE_API_TOKEN`
- `DOWNLOAD_TOKEN_SECRET`
- `TURNSTILE_SECRET_KEY`

Plain variables (in `wrangler.jsonc`):
- `MAILERLITE_GROUP_ID`
- `MAILERLITE_NEWSLETTER_GROUP_ID`
- `TURNSTILE_SITE_KEY` (public)

## Target architecture (Cloudflare)

```
Browser ──► chernyakov-coaching.com (Cloudflare DNS, GoDaddy = registrar only)
              │
              ▼
        one Cloudflare Worker  (wrangler.jsonc in apps/api)
          ├─ static assets  ← apps/web/build/client (prerendered HTML, JS, CSS, images, videos)
          └─ /api/*  (run_worker_first) → Hono app
                 ├─ POST /api/signup        → MailerLite API (server-side token)
                 ├─ GET  /api/downloads/:slug?t=<signed token> → stream PDF from R2 (private bucket)
                 └─ GET  /api/health
```

- **Same origin.** Pages and API share the domain, so there's no CORS setup.
- **Free tier:**
  - Requests for static files are free and unlimited.
  - The Worker itself gets 100k requests/day.
  - R2 storage gets 10 GB with zero egress.
  - Each static file can be at most 25 MiB. The 64.9 MB unused video gets deleted anyway. Videos actually in use are 6.4 MB and 14 MB, so they fit.
- **Gated-download flow (no webhook needed):**
  1. `POST /api/signup` checks the Turnstile captcha.
  2. It creates a MailerLite subscriber (double opt-in, group = the worksheet group) with a custom field `download_url`: the full link with a token that is an HMAC of slug + expiry, valid `DOWNLOAD_LINK_TTL_DAYS` (default 14).
  3. Only after the person confirms their email does the MailerLite automation ("joins group" trigger) send the email with the link `{$download_url}` (`https://chernyakov-coaching.com/api/downloads/unstuck?t=<token>`).
  4. The Worker checks the token and streams the PDF from the private R2 bucket.
- **Rendering:** React Router v7 framework mode with `ssr: false` and every marketing route prerendered to static HTML. SEO and social previews stay as good as today, and React takes over in the browser for the interactive parts.

## Folder structure

```
.
├── apps/
│   ├── web/                         React Router v7 + Vite + TS
│   │   ├── app/
│   │   │   ├── root.tsx             <html>/<head>, Umami script, Layout, QueryClientProvider
│   │   │   ├── routes.ts            route config (mirrors current URLs)
│   │   │   ├── routes/              home, about-me, offers._index, offers.personal-coaching,
│   │   │   │                        offers.confidence-building, offers.coaching-for-leaders,
│   │   │   │                        resources, guide, privacy  (each exports meta(): title/OG/canonical)
│   │   │   ├── components/
│   │   │   │   ├── ui/              shadcn/ui copies (button, input, checkbox, label, card, dropdown-menu, sheet, sonner)
│   │   │   │   ├── layout/          SiteHeader (transparent variant), MobileNav, OffersMenu, SiteFooter
│   │   │   │   └── sections/        HeroVideo, OfferSection, ProcessSteps, CtaBand, ResourceCard, Timeline
│   │   │   ├── features/signup/     SignupForm.tsx, useSignup.ts (TanStack Query mutation)
│   │   │   ├── lib/                 api.ts (typed Hono client), site.ts (booking URL, email, nav), seo.ts
│   │   │   └── app.css              Tailwind v4 @theme with tokens ported from styles.css :root
│   │   ├── public/                  favicon.svg, images, used videos, robots.txt, sitemap.xml, _redirects
│   │   ├── react-router.config.ts   ssr:false, prerender: [all routes]
│   │   └── vite.config.ts           dev proxy /api → wrangler dev :8787
│   └── api/                         Hono on Cloudflare Workers + TS
│       ├── src/
│       │   ├── index.ts             Hono app, mounts routes, onError; exports AppType
│       │   ├── env.ts               Bindings type (R2, secrets, vars)
│       │   ├── routes/              signup.ts, downloads.ts, health.ts
│       │   ├── services/            mailerlite.ts, tokens.ts (HMAC via WebCrypto), turnstile.ts
│       │   └── middleware/          error handler, request logging
│       ├── test/                    vitest + @cloudflare/vitest-pool-workers
│       ├── wrangler.jsonc           assets dir ../web/build/client, run_worker_first ["/api/*"], R2 binding
│       └── .dev.vars.example        names of local secrets (real .dev.vars git-ignored)
├── packages/
│   └── shared/                      zod schemas (SignupRequest/Response), resource catalog (slug, title, gated)
├── docs/                            old_architecture.md, new_architecture.md
├── .github/workflows/ci.yml         install → typecheck → lint → test → build; deploy on main
├── pnpm-workspace.yaml              packages: apps/*, packages/*
├── package.json                     "packageManager": "pnpm@<pinned>", root scripts via pnpm -r / --filter
├── tsconfig.base.json               strict, moduleResolution bundler; apps extend it
├── eslint.config.js, .prettierrc, .nvmrc (Node 24 LTS), .gitignore
```

Shared types come from Hono RPC: the API exports `AppType`, and the web app calls it through `hc<AppType>()`, so the client is typed end to end with no duplicated types. Turborepo is skipped for now: `pnpm --filter` covers two apps and one package.

## Libraries (all free / MIT)

| Area | Choice |
|------|--------|
| Frontend framework | React 19, React Router v7 (framework mode), Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Components | shadcn/ui (copy-in code, Radix primitives) |
| Icons | lucide-react |
| Animation | Motion (`motion`) for the hero and scroll reveals; respects `prefers-reduced-motion` |
| Forms | react-hook-form + zod + @hookform/resolvers |
| API calls / state | @tanstack/react-query + Hono RPC client |
| Toasts | sonner (shadcn) |
| Fonts | @fontsource-variable/inter, @fontsource-variable/source-serif-4 (self-hosted; Google Fonts removed) |
| Bot protection | Cloudflare Turnstile (@marsidev/react-turnstile) |
| Backend | Hono, @hono/zod-validator, zod |
| Tooling | TypeScript strict, ESLint (typescript-eslint, react-hooks) + Prettier, Vitest, Testing Library, Playwright (smoke), wrangler |

## Phases

**Phase 0: prerequisites (manual — see `TODO.md` §1–§4)**
- [ ] Cloudflare account + zone added (nameservers not switched yet), MailerLite API token / field / groups / automation, Turnstile widget, product decisions (canonical booking link, which PDFs are gated).

**Phase 1: monorepo scaffold**
- [ ] Root files: workspace, tsconfig, lint, prettier, `.nvmrc`, `.gitignore` (adds `.DS_Store`, `.dev.vars`, `build/`, `node_modules/`).
- [ ] `apps/web` (`create-react-router`), `apps/api` (Hono Workers template), `packages/shared`.
- [ ] CI workflow running typecheck, lint, test and build.

**Phase 2: frontend port (same look, nothing new)**
- [ ] Move the tokens and the sections from `styles.css` into the Tailwind `@theme` plus components. Use shadcn where it fits (buttons, dropdown → `DropdownMenu`, mobile drawer → `Sheet`).
- [ ] Turn the duplicated header, nav, footer and inline JS from `index.html` and the other pages into shared layout components. The transparent header's scroll behaviour moves into a hook.
- [ ] Port each page's content into its route, with `meta()` for title, description, OG, canonical and `robots`. The about page keeps its JSON-LD; `/guide/` stays `noindex`.
- [ ] Put the booking URL and email in one place, `lib/site.ts`. This replaces the dead `main.js`.
- [ ] Redirects go in `public/_redirects`: `/about.html → /about-me/` and `/offers/one-on-one-coaching/ → /offers/personal-coaching/`.
- [ ] Keep the Umami script in `root.tsx`. Remove Google Fonts.

**Phase 3: API**
- [ ] `POST /api/signup`:
  - validates `{email, consentEmail:true, consentNewsletter:boolean, turnstileToken, resource:"unstuck"}` with zod;
  - verifies Turnstile;
  - upserts the MailerLite subscriber (group, double opt-in, `download_url`), adding the newsletter group only if consented;
  - maps MailerLite errors to 4xx/5xx with readable messages.
- [ ] `GET /api/downloads/:slug`: checks the HMAC and expiry with a constant-time compare, then streams from R2 with `Content-Disposition: attachment`. Bad or expired tokens get a 403 and a link back to `/guide/`.
- [ ] `env.ts` Bindings type for the secrets and vars listed under "Secrets handling"; `.dev.vars.example` with the names only.

**Phase 4: reactive signup**
- [ ] `SignupForm`: react-hook-form + zod (shared schema) + Turnstile + a `useSignup` mutation. Real loading, success and error states, replacing today's always-success `no-cors` behaviour.

**Phase 5: gated assets and cleanup**
- [ ] Upload the gated PDFs to a private R2 bucket. Drop them from public assets; `/resources/` links to `/guide/` for gated items.
- [ ] Delete unused media and the duplicate `PDFs/`. Move the CV, ICF study guide, DNS export and `runway-video-guide.md` out of the published output; the owner decides what is kept in the repo.

**Phase 6: preview deploy**
- [ ] `wrangler deploy` to `*.workers.dev`. Run Playwright smoke tests and a Lighthouse/SEO comparison with the live site.

**Phase 7: cutover (DNS / dashboard steps are manual — see `TODO.md` §5–§7)**
- [ ] Add the custom domain (`chernyakov-coaching.com` + `www`) to the Worker in `wrangler.jsonc` (`routes` with `custom_domain: true`); `www` → apex redirect.
- [ ] Remove `CNAME` and `.nojekyll`; delete the old static files once parity is confirmed.
- [ ] Update the privacy policy: Cloudflare replaces GitHub as host, add Turnstile and Cloudflare R2, remove Google Fonts, fill in the controller's address.
- [ ] Write `docs/new_architecture.md`. Rewrite `README.md` and `DEPLOY.md` for pnpm and wrangler.

## Risks
- **Email outage at the nameserver switch.** Email is not hosted by GoDaddy or GitHub; it is Google Workspace (inbox) and MailerLite (sending), and both only work because of DNS records. Once Cloudflare becomes the DNS server, only records that exist in Cloudflare are answered:
  - missing MX → incoming mail to `michael@…` bounces;
  - missing SPF / DKIM → Gmail and MailerLite mail fails authentication and, with DMARC `p=quarantine`, lands in spam;
  - missing verification TXT → Google Search Console / MailerLite domain verification breaks.
  - Cloudflare auto-imports most records but not reliably all; and the DKIM CNAME `litesrv._domainkey` must be **DNS only (grey cloud)** — proxied, it resolves to Cloudflare instead of MailerLite and DKIM fails.
  - Mitigation: copy the zone export record by record, compare after import, switch at a quiet time, test mail both ways right after (`TODO.md` §5–§6).
- **Pre-existing gap: no Google Workspace DKIM.** The zone has no `google._domainkey` record, so mail sent from Gmail is not DKIM-signed and relies on SPF alone for DMARC. Not caused by the migration; fix it at the same time (`TODO.md` §6).
- **MailerLite API details.** Double opt-in for API signups and using custom fields in automations are both MailerLite settings. Check them against the current API docs in Phase 0.
- **Prerender mismatch.** Content that differs between the prerendered HTML and the browser (for example the footer year) causes React hydration warnings. Render the year on the client only.

## Verification
- `pnpm install --frozen-lockfile && pnpm -r typecheck && pnpm -r lint && pnpm -r test && pnpm -r build`.
- API unit tests (vitest-pool-workers):
  - signup: valid → 200; bad email → 400; failed Turnstile → 403; MailerLite 5xx → 502;
  - token: sign/verify, expired and tampered tokens;
  - download: valid → PDF bytes; invalid → 403.
- Local end to end: `pnpm dev` (web on Vite + `wrangler dev` with local R2); submit the form against a test MailerLite group; open the download link from the email.
- Prerender check: `build/client/**/index.html` contains the page text and the OG/canonical tags for each route. Redirects work.
- Before DNS cutover: Playwright smoke on workers.dev (nav, dropdown, mobile drawer, signup happy path with the Turnstile test key, videos load). Lighthouse SEO and accessibility at least as good as the current site.
- After cutover: `dig MX/TXT chernyakov-coaching.com` matches the export; send a test email to and from Workspace; HTTPS on apex and `www`.
