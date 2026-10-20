# Deploy guide — Cloudflare Workers

The whole site runs as one Cloudflare Worker named `chernyakov-coaching` (config: `apps/api/wrangler.jsonc`). It serves two things:
- the prerendered pages from `apps/web/build/client`, as static assets;
- the API under `/api/*`.

One-time setup (accounts, R2 bucket, Turnstile, MailerLite, secrets, DNS) is listed step by step in `TODO.md`. This file covers day-to-day deploys.

## Preview deploy (workers.dev)

Prerequisites:
- `TODO.md` §2–§4 are done.
- `pnpm --filter @coaching/api exec wrangler login` has been run once.

```bash
# The public Turnstile site key is baked into the build
VITE_TURNSTILE_SITE_KEY=<site key> pnpm deploy
```

Wrangler prints the URL (`https://chernyakov-coaching.<account>.workers.dev`). Check it before touching DNS:
- every page loads;
- `/api/health` returns `{"ok":true}`;
- the signup on `/guide/` works, and the email link downloads the PDF.

## Production (custom domain)

At cutover (`TODO.md` §5):
1. Uncomment the `routes` block in `apps/api/wrangler.jsonc`.
2. Deploy again. Cloudflare attaches `chernyakov-coaching.com` and `www` to the Worker and creates the DNS records.

## Deploy from GitHub Actions

`.github/workflows/ci.yml` runs typecheck, lint, format check, build and tests on every push except to `main`.

To deploy from CI:
1. Run the workflow manually (Actions → CI → Run workflow) with **deploy** ticked.
2. It needs these settings in the GitHub repo:
   - secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
   - repository variable `TURNSTILE_SITE_KEY`;
   - an environment named `production`.

## Secrets

Set once per Worker. Each command prompts for the value, so it never lands in shell history:

```bash
cd apps/api
pnpm exec wrangler secret put MAILERLITE_API_TOKEN
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
pnpm exec wrangler secret put DOWNLOAD_TOKEN_SECRET
```

Plain variables (`MAILERLITE_GROUP_ID`, `MAILERLITE_NEWSLETTER_GROUP_ID`, `DOWNLOAD_LINK_TTL_DAYS`) live in `wrangler.jsonc` under `vars`.

## Rollback

```bash
cd apps/api
pnpm exec wrangler deployments list
pnpm exec wrangler rollback <version-id>
```

## Troubleshooting

- **Signup returns 500 `server_misconfigured`.** A secret or var is missing. Check the Worker's settings in the Cloudflare dashboard, or the logs (`pnpm exec wrangler tail`).
- **Signup returns 403 `captcha_failed`.** The Turnstile site key in the build and the secret key on the Worker are not from the same widget, or the widget's hostname list is missing the domain.
- **Download link redirects to `/guide/?link=invalid`.** `DOWNLOAD_TOKEN_SECRET` changed after the link was issued, or the link was cut off. If it redirects to `?link=expired`, the link is older than `DOWNLOAD_LINK_TTL_DAYS`.
- **Download returns 404.** The object is missing from the R2 bucket `coaching-downloads`. See `TODO.md` §3.
