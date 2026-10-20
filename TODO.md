# Manual TODO — Cloudflare migration

Steps that have to be done by hand in a dashboard or account (code work is in `docs/new_architecture_plan.md`).
**Never paste tokens or secrets into this file or any other file in the repo.**

Owner key: **M** = Michael (account owner), **D** = developer.

## 1. Decisions (before Phase 2)

- [ ] **M** Pick the one booking link to keep. Three are live today:
  - `https://calendar.app.google/iF25YMjAwqjbfpdF8` (nav "Book a call")
  - `https://calendar.app.google/MXdrHfJUWrtYFRPc9` (intro-call buttons)
  - `https://calendar.app.google/o5aKAvfYqwtAx6nRA` (home "discovery session")
- [ ] **M** Confirm which PDFs are gated behind signup. Default: only *The Unstuck Question Toolkit*; *The Four Goals Workbook* stays free.
- [ ] **M** Decide what happens to unlinked files that are public today: `Michael-Chernyakov-CV.pdf`, `PDFs/ICF-ACC-Exam-Study-Guide.pdf`, `chernyakov-coaching.com.txt`, `runway-video-guide.md`. Keep (unpublished) or delete.
- [ ] **M** Provide the controller's street address and postal code / city for the privacy policy.

## 2. Cloudflare account (before Phase 1 deploys)

- [ ] **M** Create a Cloudflare account (free plan) and enable 2FA.
- [ ] **M** Add the site `chernyakov-coaching.com` (free plan). **Do not change nameservers at GoDaddy yet** (§5).
- [ ] **M** Note the **Account ID** (dashboard sidebar). It is not secret, but keep it out of the repo anyway.
- [ ] **M** Create an **API token** for deploys: My Profile → API Tokens → template "Edit Cloudflare Workers", scoped to this account and zone.
- [ ] **M/D** Add GitHub repo secrets (Settings → Secrets and variables → Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- [ ] **D** Run `pnpm wrangler login` locally (opens browser) for local deploys.

## 3. Cloudflare services

- [ ] **M/D** R2: enable R2 (asks for a payment method even on the free tier; free usage is 10 GB), create a **private** bucket `coaching-downloads`.
- [ ] **D** Upload the gated PDF(s): `pnpm wrangler r2 object put coaching-downloads/unstuck.pdf --file downloads/Unstuck_Question_Toolkit_Worksheet.pdf --remote`.
- [ ] **M/D** Turnstile: create a widget for `chernyakov-coaching.com` + the `*.workers.dev` preview host. Note the **site key** (public) and **secret key** (secret).
- [ ] **D** Set Worker secrets (prompted, never on the command line):
  - `pnpm --filter api wrangler secret put MAILERLITE_API_TOKEN`
  - `pnpm --filter api wrangler secret put TURNSTILE_SECRET_KEY`
  - `pnpm --filter api wrangler secret put DOWNLOAD_TOKEN_SECRET` (generate with `openssl rand -base64 32`)
- [ ] **D** Fill local `apps/api/.dev.vars` (git-ignored) with test values for local dev.

## 4. MailerLite

- [ ] **M** Create an API token: Integrations → MailerLite API → Generate new token. Store it only in a password manager, then hand it to `wrangler secret put` (§3).
- [ ] **M** Create a custom field `download_token` (type: text).
- [ ] **M** Create groups: `Unstuck worksheet` and `Newsletter`. Send both group IDs to the developer (they go in `wrangler.jsonc` as plain vars).
- [ ] **M** Enable double opt-in for API / integration signups (Account settings → Subscribe settings). Check the confirmation email text.
- [ ] **M** Create an automation: trigger "Subscriber joins group → Unstuck worksheet", one email containing the button link `https://chernyakov-coaching.com/api/downloads/unstuck?t={$download_token}`.
- [ ] **D** Verify against the current MailerLite API docs that API-created subscribers in the unconfirmed state receive the confirmation email and only enter the automation after confirming.
- [ ] **M** After cutover: delete or disable the old embedded form `197441156622058500` (it is no longer used).

## 5. DNS move to Cloudflare (cutover day, Phase 7)

Email depends on these records. If one is missing after the switch, mail breaks (see "Email outage" risk in the plan).

- [ ] **M** 24 h before: at GoDaddy, lower the TTL of the records to 600 s (optional but speeds rollback).
- [ ] **M** In Cloudflare → DNS → Records, check that every record from `chernyakov-coaching.com.txt` exists:

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
- [ ] **D** Attach the custom domains to the Worker (deploy with `routes` in `wrangler.jsonc`, or Workers → Settings → Domains & Routes). Cloudflare creates the apex/`www` records itself.
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
- [ ] **D** Remove `CNAME`, `.nojekyll` and the old static files from the repo (Phase 7 in the plan).
