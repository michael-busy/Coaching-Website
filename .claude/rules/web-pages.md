---
description: Frontend rules for the prerendered React Router site (apps/web).
paths:
  - "apps/web/**"
---

# Web (React Router, prerendered)

- **Every page is prerendered.** A new route needs: an entry in `app/routes.ts`, its path in `PRERENDER_PATHS` (`react-router.config.ts`), a `meta()` with title, description and canonical, and an entry in `public/sitemap.xml`.
- **No hydration mismatches.** Render nothing during the first render that differs between build time and the browser (dates, `window`, query params, `localStorage`). Use `useHydrated()` (`app/hooks/use-hydrated.ts`).
- **Styling:** reuse the existing classes in `app/styles/site.css` for page content. New UI uses Tailwind utilities and the shadcn components in `app/components/ui/` with the site tokens (`app/app.css`). No new global CSS without need.
- **Single sources:** booking links, email and third-party ids come from `app/lib/site.ts`; resource copy from `app/lib/resources.tsx`. Never hard-code them in a page.
- **Page text** is the owner's: see `copy-and-legal.md` before changing any wording.
- **Old URLs keep working:** when a page moves, add a `301` in `public/_redirects`.
- **API calls** go to same-origin `/api/*` and parse the response with the shared zod schema (see `app/lib/api.ts`).
- **No public PDFs** in `public/` — downloads are served from R2 through `/api/downloads`.
