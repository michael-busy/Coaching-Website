# Manual TODO — Cloudflare migration

Steps that have to be done by hand in a dashboard or account (code work is in `docs/new_architecture_plan.md`).
**Never paste tokens or secrets into this file or any other file in the repo.**

Owner key: **M** = Michael (account owner), **D** = developer.

## 1. Decisions

- [ ] **M** Pick the one booking link to keep, then point all three keys of `BOOKING` in `apps/web/app/lib/site.ts` at it. Three are live today:
  - `https://calendar.app.google/iF25YMjAwqjbfpdF8` (nav "Book a call")
  - `https://calendar.app.google/MXdrHfJUWrtYFRPc9` (intro-call buttons)
  - `https://calendar.app.google/o5aKAvfYqwtAx6nRA` (home "discovery session")
- [ ] **M** Confirm which PDFs are gated behind signup. Implemented default: only *The Unstuck Question Toolkit* (the `/resources/` card now links to `/guide/`); *The Four Goals Workbook* stays a free download. The catalog is in `packages/shared/src/resources.ts`.
- [ ] **M** Note: the GitHub repo is **public** and the Unstuck PDF is in `main`'s history (`downloads/`), so anyone can still get it from GitHub. For real gating, make the repo private (needs a paid GitHub plan only if GitHub Pages must stay on until cutover) or accept this.
- [ ] **M** Review the copy changes that gating required on `/resources/` (hero no longer says "no signup, no email required"; the Unstuck card says "sent to your inbox").
- [ ] **M** Unlinked files were removed from this branch (still on `main`, restore with `git show main:<path> > <path>` if wanted): `Michael-Chernyakov-CV.pdf`, `PDFs/ICF-ACC-Exam-Study-Guide.pdf`, unused videos and photos. The DNS export and `runway-video-guide.md` moved to `docs/reference/`.
- [ ] **M** Provide the controller's street address and postal code / city for the privacy policy (`apps/web/app/routes/privacy.tsx`, §1). Also set the "Last updated" date when the new policy goes live.

## 2. Cloudflare account

- [ ] **M** Create a Cloudflare account (free plan) and enable 2FA.
- [ ] **M** Add the site `chernyakov-coaching.com` (free plan). **Do not change nameservers at GoDaddy yet** (§5).
- [ ] **M** Note the **Account ID** (dashboard sidebar). It is not secret, but keep it out of the repo anyway.
- [ ] **M** Create an **API token** for deploys: My Profile → API Tokens → template "Edit Cloudflare Workers", scoped to this account and zone.
- [ ] **M/D** Add GitHub repo secrets (Settings → Secrets and variables → Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; create an environment named `production` (used by the deploy job).
- [ ] **D** Run `pnpm --filter @coaching/api exec wrangler login` locally (opens browser) for local deploys.

## 3. Cloudflare services

- [ ] **M/D** R2: enable R2 (asks for a payment method even on the free tier; free usage is 10 GB), create a **private** bucket `coaching-downloads`.
- [ ] **D** Upload the gated PDF (it is no longer in the working tree):
  ```bash
  git show main:downloads/Unstuck_Question_Toolkit_Worksheet.pdf > /tmp/unstuck.pdf
  pnpm --filter @coaching/api exec wrangler r2 object put coaching-downloads/unstuck.pdf \
    --file /tmp/unstuck.pdf --content-type application/pdf --remote
  ```
- [ ] **M/D** Turnstile: create a widget (mode "Managed") for `chernyakov-coaching.com` + the `*.workers.dev` preview host. Note the **site key** (public) and **secret key** (secret).
- [ ] **M/D** Add the site key as GitHub repository **variable** `TURNSTILE_SITE_KEY` (CI builds bake it in as `VITE_TURNSTILE_SITE_KEY`). Without it the build uses Cloudflare's test key and production signups fail with `captcha_failed`.
- [ ] **D** Set Worker secrets (prompted, never on the command line):
  - `pnpm --filter @coaching/api exec wrangler secret put MAILERLITE_API_TOKEN`
  - `pnpm --filter @coaching/api exec wrangler secret put TURNSTILE_SECRET_KEY`
  - `pnpm --filter @coaching/api exec wrangler secret put DOWNLOAD_TOKEN_SECRET` (generate with `openssl rand -base64 32`)
- [ ] **D** Fill local `apps/api/.dev.vars` (git-ignored; copy `.dev.vars.example`) with test values for local dev.

## 4. MailerLite

- [ ] **M** Create an API token: Integrations → MailerLite API → Generate new token. Store it only in a password manager, then hand it to `wrangler secret put` (§3).
- [ ] **M** Create a custom field `download_url` (type: text). The API fills it with the full signed link on every signup.
- [ ] **M** Create groups: `Unstuck worksheet` and `Newsletter`. Send both group IDs to the developer.
- [ ] **D** Put the group IDs in `apps/api/wrangler.jsonc` → `vars.MAILERLITE_GROUP_ID` / `vars.MAILERLITE_NEWSLETTER_GROUP_ID` (they are empty now, so signups fail with `server_misconfigured` until set).
- [ ] **M** Enable double opt-in for API / integration signups (Account settings → Subscribe settings). Check the confirmation email text.
- [ ] **M** Create an automation: trigger "Subscriber joins group → Unstuck worksheet", one email whose button links to `{$download_url}` (links expire after `DOWNLOAD_LINK_TTL_DAYS`, default 14).
- [ ] **D** Verify against the current MailerLite API docs that API-created subscribers in the unconfirmed state receive the confirmation email and only enter the automation after confirming. Also check that a subscriber who is already confirmed gets the email again when re-added to the group (the API code assumes so).
- [ ] **M** After cutover: delete or disable the old embedded form `197441156622058500` (it is no longer used).

## 5. DNS move to Cloudflare (cutover day, Phase 7)

Email depends on these records. If one is missing after the switch, mail breaks (see "Email outage" risk in the plan).

- [ ] **M** 24 h before: at GoDaddy, lower the TTL of the records to 600 s (optional but speeds rollback).
- [ ] **M** In Cloudflare → DNS → Records, check that every record from `docs/reference/dns-zone-export-2026-09-08.txt` exists:

  | Type | Name | Value | Proxy |
  |------|------|-------|-------|
  | MX | @ | `aspmx.l.google.com` (prio 1) | n/a |
  | MX | @ | `alt1.aspmx.l.google.com` (5) | n/a |
  | MX | @ | `alt2.aspmx.l.google.com` (5) | n/a |
  | MX | @ | `alt3.aspmx.l.google.com` (10) | n/a |
  | MX | @ | `alt4.aspmx.l.google.com` (10) | n/a |
  | TXT | @ | `v=spf1 include:_spf.mlsend.com include:dc-aa8e722993._spfm.chernyakov-coaching.com ~all` | n/a |
  | TXT | `dc-aa8e722993._spfm` | `v=spf1 include:_spf.google.com ~all` | n/a |
  | TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | n/a |
  | TXT | @ | `google-site-verification=Kg9e-h6q3joY4ACoayDR_5lieSKKYV8usc0uRyrsZV0` | n/a |
  | TXT | @ | `mailerlite-domain-verification=d7cc59f8346ad0d790c9273c6dfb98e0203e0d93` | n/a |
  | CNAME | `litesrv._domainkey` | `litesrv._domainkey.mlsend.com` | **DNS only (grey)** |

- [ ] **M** Delete imported records that will be replaced: the 4 GitHub Pages `A` records for `@`, the `www` CNAME to `michael-busy.github.io`, and `_domainconnect` (GoDaddy-only).
- [ ] **D** Attach the custom domains to the Worker: uncomment `routes` in `apps/api/wrangler.jsonc` and deploy (or Workers → Settings → Domains & Routes). Cloudflare creates the apex/`www` records itself.
- [ ] **M** At GoDaddy → Domain → DNS → Nameservers → "I'll use my own nameservers": enter the two Cloudflare nameservers shown in the Cloudflare dashboard. Leave DNSSEC off at GoDaddy (turn it on later from Cloudflare if wanted).
- [ ] **M** Wait for Cloudflare to show the zone as **Active** (minutes to a few hours).

## 6. Post-cutover checks

- [ ] **D** `dig NS chernyakov-coaching.com +short` → Cloudflare nameservers.
- [ ] **D** `dig MX chernyakov-coaching.com +short` and `dig TXT chernyakov-coaching.com +short` → match the table in §5.
- [ ] **M** Send an email from a personal account to `michael@chernyakov-coaching.com`, and reply from it. Check the reply's headers show `spf=pass` and `dmarc=pass`.
- [ ] **M** Do a test signup on `/guide/` with a personal address: confirmation email arrives, then the download email, and the link downloads the PDF.
- [ ] **D** `https://chernyakov-coaching.com` and `https://www.chernyakov-coaching.com` load over HTTPS; old URLs (`/about.html`, `/offers/one-on-one-coaching/`) redirect.
- [ ] **M** Optional fix for a pre-existing gap: turn on DKIM for Google Workspace (Admin console → Apps → Gmail → Authenticate email → generate key), add the `google._domainkey` TXT record in Cloudflare, then click "Start authentication".
- [ ] **M** Google Search Console: confirm the property is still verified; resubmit `sitemap.xml`.
- [ ] **M** Umami: check visits still arrive.

## 7. Decommission

- [ ] **M** GitHub repo → Settings → Pages → unpublish / set source to "None" (only after §6 passes).
- [ ] **M** GoDaddy: nothing else to cancel (domain registration stays at GoDaddy, keep auto-renew on).
- [x] **D** Remove `CNAME`, `.nojekyll` and the old static files from the repo — done on branch `new_architecture_be_fe`; takes effect when it is merged.
- [ ] **M** Merge `new_architecture_be_fe` into `main` only after GitHub Pages is switched off (merging removes the static site that Pages serves).
