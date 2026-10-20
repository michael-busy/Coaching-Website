---
description: DNS, custom domain and email-authentication records — mistakes here break the owner's email.
paths:
  - "apps/api/wrangler.jsonc"
  - "docs/reference/**"
  - "TODO.md"
  - "DEPLOY.md"
---

# DNS and email

The domain `chernyakov-coaching.com` is registered at GoDaddy; DNS moves to Cloudflare at cutover. Email runs on **Google Workspace** (inbox) and **MailerLite** (sending) — both depend on DNS records, not on the website.

- **Never remove or edit an email record** without the owner's explicit OK:
  - MX → `aspmx.l.google.com` and the four `alt*` hosts;
  - SPF TXT on `@` and `dc-aa8e722993._spfm`;
  - `_dmarc` TXT (`p=quarantine` — broken SPF/DKIM sends mail to spam);
  - DKIM CNAME `litesrv._domainkey` → `litesrv._domainkey.mlsend.com`;
  - Google and MailerLite verification TXT records.
- **Email records are never proxied** in Cloudflare: the DKIM CNAME must be **DNS only (grey cloud)**; MX/TXT can't be proxied.
- **Source of truth:** `docs/reference/dns-zone-export-2026-09-08.txt`. The record table in `TODO.md` §5 must match it; update both together.
- **Website records:** only the apex and `www` point at the site. They are created by the Worker's custom-domain `routes` in `apps/api/wrangler.jsonc`; don't add manual A/CNAME records for them.
- **Don't change nameservers or DNS from the CLI or the API.** DNS changes are manual steps for the owner, listed in `TODO.md`.
- After any DNS change, check mail both ways (`TODO.md` §6) before anything else.
