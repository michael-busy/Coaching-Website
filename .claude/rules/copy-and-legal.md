---
description: Customer-facing wording and legal text belong to the site owner — change them only on request and flag every change.
paths:
  - "apps/web/app/routes/**"
  - "apps/web/app/lib/resources.tsx"
  - "apps/web/app/features/signup/**"
---

# Copy and legal text

- **The owner writes the copy.** Don't rewrite, "improve" or translate page text unless asked. Port or move existing text verbatim.
- **Never invent facts:** no new claims about certifications, clients, prices, results, testimonials or availability.
- **If new copy is unavoidable** (e.g. a button for a new feature), keep it short and plain, reuse existing phrasing, and add a review item to `TODO.md` §1.
- **Privacy policy** (`routes/privacy.tsx`):
  - any change to what is collected, why, where it is stored or for how long → update the matching section in the same change;
  - mark unknown facts as visible placeholders (`<em>[retention period]</em>`), never guess;
  - flag every change for the owner's legal review in `TODO.md` §1, and remind them to update "Last updated".
- **Consent wording** next to a checkbox is legal text: changing it means bumping `OFFERS_CONSENT_VERSION` (see `resources-and-consent.md`).
- **JSX whitespace:** text that ends a line before an inline element (`<a>`, `<strong>`) needs `{" "}`, or the words get glued together.
