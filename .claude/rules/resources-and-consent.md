---
description: Gated downloads, MailerLite and GDPR consent — how to add a resource and what must never change silently.
paths:
  - "packages/shared/src/**"
  - "apps/api/src/routes/signup.ts"
  - "apps/api/src/services/mailerlite.ts"
  - "apps/web/app/features/signup/**"
  - "apps/web/app/lib/resources.tsx"
  - "apps/web/app/routes/privacy.tsx"
---

# Resources, MailerLite and consent

**Adding a resource** (all steps, same change):
1. `packages/shared/src/resources.ts`: slug, title, `r2Key`, `fileName`.
2. `apps/web/app/lib/resources.tsx`: page copy (the type forces an entry per slug).
3. `scripts/seed-r2.mjs`: the source file for its `r2Key`.
4. `public/sitemap.xml`: the new `/resources/<slug>/` page.

No MailerLite change is needed: every downloader joins the one `Downloads` group, and the slug is added to their `downloads` field.

**Consent (GDPR) — never break these:**
- The download never depends on the offers checkbox. The box stays optional and unticked.
- Changing the checkbox wording → bump `OFFERS_CONSENT_VERSION` (`packages/shared/src/signup.ts`) and check privacy policy §8.
- Never downgrade an existing subscriber: no status change and no `marketing_consent: "no"` for someone already in MailerLite. Rules live in `subscriberUpdate` (`apps/api/src/services/mailerlite.ts`) and its tests.
- Never set `status: "active"` from the API: that skips double opt-in.
- Any change to what is collected or stored → update privacy policy §8 and flag it for the owner's review (`copy-and-legal.md`).
- Test every consent/status rule change table-style in `apps/api/test/mailerlite.test.ts`.
