# TODO: manual steps to go live

Everything below is done by hand in a dashboard or account. The code is ready on branch `new_architecture_be_fe`.

- **Who:** **M** = Michael (account owner), **D** = developer.
- **Order:** do the sections top to bottom. Nothing goes live until step 5.
- **Never** paste tokens or secrets into this file or anywhere in the repo.

## Values the site needs

Everything production needs, and where each one goes. "Step" is the section below where it gets created.

**Secrets.** Paste only into the place listed; never into a file.

| Name | Goes in | What it is | Get it from | Step |
|------|---------|------------|-------------|------|
| `MAILERLITE_API_TOKEN` | Worker secret (`wrangler secret put`) | Lets the API create subscribers | MailerLite → Integrations → API → Generate token | 3 |
| `TURNSTILE_SECRET_KEY` | Worker secret | Server side of the bot check | Cloudflare → Turnstile → the widget | 2 |
| `DOWNLOAD_TOKEN_SECRET` | Worker secret | Signs the download links | Make one up: `openssl rand -base64 32` | 2 |

**Plain config (not secret).**

| Name | Goes in | Value | Step |
|------|---------|-------|------|
| `MAILERLITE_DOWNLOADS_GROUP_ID` | `apps/api/wrangler.jsonc` → `vars` | ID of the `Downloads` group (already set) | — |
| `MAILERLITE_OFFERS_GROUP_ID` | `apps/api/wrangler.jsonc` → `vars` | ID of the `Offers` group (already set) | — |
| `DOWNLOAD_LINK_TTL_HOURS` | `apps/api/wrangler.jsonc` → `vars` | `24` (already set) | — |
| `VITE_TURNSTILE_SITE_KEY` | Typed in front of `pnpm deploy` (step 4) | Public half of the Turnstile widget, built into the pages | 2 |

**Created in dashboards.** These have no value to copy, but the code expects them to exist under these exact names.

| What | Where | Step |
|------|-------|------|
| Private R2 bucket `coaching-downloads`, with both PDFs (`pnpm r2:seed --remote`) | Cloudflare | 2 |
| "Managed" Turnstile widget for `chernyakov-coaching.com` and `*.workers.dev` | Cloudflare | 2 |
| Groups `Downloads` and `Offers` (done; `TEST_Downloads` / `TEST_Offers` for local tests) | MailerLite | 3 |
| Text fields `downloads`, `last_download`, `marketing_consent`, `marketing_consent_at`, `consent_text_version` (done) | MailerLite | 3 |
| "Double opt-in for API and integrations" turned on | MailerLite → Subscribe settings | 3 |

**Local development needs none of these.** `pnpm dev` creates `apps/*/.env` with test values: MailerLite runs in dry-run mode and Turnstile uses Cloudflare's test keys. To try a real MailerLite account locally, set `MAILERLITE_DRY_RUN=false` in `apps/api/.env` and add the token and **test** group IDs there.

## 1. Decisions and content (M)

- [ ] **Booking link.** Three different links are live today. Pick one, and the developer points all three keys of `BOOKING` in `apps/web/app/lib/site.ts` at it.
  - `…/iF25YMjAwqjbfpdF8`: header "Book a call"
  - `…/MXdrHfJUWrtYFRPc9`: "intro call" buttons
  - `…/o5aKAvfYqwtAx6nRA`: home "discovery session"
- [ ] **Privacy policy:**
  - fill in the street address and postal code/city in §1, and the retention period placeholder in §8;
  - have §8 ("Free downloads and offers") reviewed by someone qualified;
  - set "Last updated" on launch day.
- [ ] **Copy review:**
  - the `/resources/` cards and the two resource pages;
  - the offers checkbox wording (`apps/web/app/features/signup/SignupForm.tsx`). If it changes later, bump `OFFERS_CONSENT_VERSION` in `packages/shared/src/signup.ts`;
  - the two new email-field errors (`apps/api/src/routes/signup.ts`): "Please use your regular email address. Temporary inboxes can't be used." and "That email address can't receive mail. Please check it for typos."
- [ ] **Public repo:** the PDFs can still be downloaded from GitHub's history. Make the repo private, or accept this.
- [ ] **Protect `main`** (needs repo admin): GitHub → Settings → Branches → Add rule for `main` → tick "Require a pull request before merging" and "Require status checks to pass", and select **"Typecheck, lint, build and test"**. Then a PR can't be merged while tests fail.
- [ ] **Removed files:** the CV, the ICF study guide, and unused videos and photos are gone from the branch. Restore any you want with `git show 795db31:<path> > <path>`.

## 2. Cloudflare setup

- [ ] **M** Create a free Cloudflare account with 2FA, and add the site `chernyakov-coaching.com`. **Don't change the nameservers yet** (that's step 5).
- [ ] **M/D** **R2:** enable it (it asks for a card, but 10 GB is free) and create a **private** bucket `coaching-downloads`. Then **D** runs `pnpm r2:seed --remote` to upload both PDFs.
- [ ] **M/D** **Turnstile:** create a "Managed" widget for `chernyakov-coaching.com` and the `*.workers.dev` preview host. Note the **site key** for the deploy command (step 4); the secret key is set in the next step.
- [ ] **D** Log in and set the Worker secrets. Each command prompts for the value:
  ```bash
  cd apps/api
  pnpm exec wrangler login
  pnpm exec wrangler secret put MAILERLITE_API_TOKEN    # from step 3
  pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
  pnpm exec wrangler secret put DOWNLOAD_TOKEN_SECRET   # any random value: openssl rand -base64 32
  ```

## 3. MailerLite setup

- [ ] **M** Create an API token (Integrations → API). Keep it in a password manager and give it to the developer for `wrangler secret put`.
- [x] **M** **Groups:** `Downloads` and `Offers` (IDs in `wrangler.jsonc`), plus `TEST_Downloads` and `TEST_Offers` for local tests (IDs in `apps/api/.env`).
  - Every downloader joins `Downloads`; the `downloads` field lists what they got (e.g. `four-goals,unstuck`). For "everyone who got the workbook", make a segment: `downloads` contains `four-goals`.
- [x] **M** **Custom fields** (type text): `downloads`, `last_download`, `marketing_consent`, `marketing_consent_at`, `consent_text_version`.
- [x] **D** Put the group IDs into `apps/api/wrangler.jsonc` → `vars`. If a group is ever recreated, its ID changes: update it there, or downloads fail with `server_misconfigured`.
- [ ] **M** Turn on **"Double opt-in for API and integrations"** (Account settings → Subscribe settings). Reword the confirmation email to "confirm you'd like to receive offers". Optionally, set the page after confirmation to `https://chernyakov-coaching.com/resources/`.
- [ ] **M** From now on, send offers **only to the `Offers` group**. People who didn't tick the box are stored as `unsubscribed` and can't be emailed.
- [ ] **D** Test with a test group and `MAILERLITE_DRY_RUN=false` in `apps/api/.env`:

  | Case | Expected |
  |------|----------|
  | New email, offers ticked | `unconfirmed`, confirmation email arrives |
  | New email, not ticked | `unsubscribed`, no email |
  | Existing subscriber, not ticked | Status unchanged |
  | Unsubscribed subscriber, ticked | Back to `unconfirmed`, confirmation email arrives |

- [ ] **M** Delete what's no longer used: the old embedded form `197441156622058500` (after launch), plus any download automation or `download_url` field you created earlier.

## 4. Preview deploy (no DNS change yet)

- [ ] **D** Deploy from your machine (after `wrangler login`): `VITE_TURNSTILE_SITE_KEY=<site key> pnpm deploy`.
- [ ] **D/M** On the `*.workers.dev` URL, check (with `pnpm exec wrangler tail` running, showing no errors):
  - every page loads, and `/api/health` returns `{"ok":true}`;
  - for **both** resources: `/resources/` → card → enter an email → the download starts;
  - with offers ticked: the confirmation email arrives, and the subscriber is in the right groups with the fields filled in;
  - `/guide/` and the old `/downloads/*.pdf` links redirect to the resource pages.

## 5. Go live: move DNS to Cloudflare (M, with D)

> **Email risk:** after the switch, Cloudflare answers all DNS lookups. Any record missing in Cloudflare breaks it. A missing MX means mail to `michael@…` bounces. A missing SPF or DKIM record sends your outgoing mail to spam.

- [ ] **The day before:** lower the TTLs at GoDaddy to 600 s (optional, but makes a rollback faster).
- [ ] In Cloudflare → DNS, make sure **all** of these exist. They're from `docs/reference/dns-zone-export-2026-09-08.txt`:

  | Type | Name | Value | Note |
  |------|------|-------|------|
  | MX | @ | `aspmx.l.google.com` (1), `alt1`/`alt2.aspmx.l.google.com` (5), `alt3`/`alt4.aspmx.l.google.com` (10) | 5 records |
  | TXT | @ | `v=spf1 include:_spf.mlsend.com include:dc-aa8e722993._spfm.chernyakov-coaching.com ~all` | |
  | TXT | `dc-aa8e722993._spfm` | `v=spf1 include:_spf.google.com ~all` | |
  | TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | |
  | TXT | @ | `google-site-verification=Kg9e-h6q3joY4ACoayDR_5lieSKKYV8usc0uRyrsZV0` | |
  | TXT | @ | `mailerlite-domain-verification=d7cc59f8346ad0d790c9273c6dfb98e0203e0d93` | |
  | CNAME | `litesrv._domainkey` | `litesrv._domainkey.mlsend.com` | **DNS only (grey cloud)**, or DKIM breaks |

- [ ] Delete the old website records:
  - the 4 GitHub Pages `A` records on `@`;
  - `www` → `michael-busy.github.io`;
  - `_domainconnect`.
- [ ] **D** Attach the domain to the Worker: uncomment `routes` in `apps/api/wrangler.jsonc` and deploy. Cloudflare creates the `@` and `www` records itself.
- [ ] At GoDaddy → Domain → DNS → Nameservers → "I'll use my own": enter the two Cloudflare nameservers. Leave DNSSEC off. Wait until Cloudflare shows the zone as **Active**.

## 6. After going live

- [ ] **D** `dig NS`, `dig MX` and `dig TXT chernyakov-coaching.com +short` match Cloudflare and the table above.
- [ ] **M** Send an email to `michael@chernyakov-coaching.com` and reply from it. The reply's headers should show `spf=pass` and `dmarc=pass`.
- [ ] **D/M** Repeat the step 4 checks on `https://chernyakov-coaching.com`, and confirm `www` and these old URLs redirect: `/about.html`, `/offers/one-on-one-coaching/`, `/guide/`, `/downloads/*.pdf`.
- [ ] **M** Google Search Console: is the site still verified? Resubmit `sitemap.xml`.
- [ ] **M** Umami: are visits still arriving?
- [ ] **M** Optional (an old gap): turn on DKIM for Google Workspace (Admin → Gmail → Authenticate email), and add the `google._domainkey` TXT record in Cloudflare.

## 7. Clean up

- [ ] **M** GitHub → Settings → Pages: set the source to "None". Do this only after step 6 passes.
- [ ] **M** Then merge `new_architecture_be_fe` into `main`. Merging earlier would take down the old site while GitHub Pages still serves it.
- [ ] **M** GoDaddy: nothing to cancel. The domain stays registered there, so keep auto-renew on.
