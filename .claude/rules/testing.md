---
description: Where tests live and what must be tested in this repo.
paths:
  - "apps/**"
  - "packages/**"
---

# Testing

| Package | Where | Runner | Pattern |
|---------|-------|--------|---------|
| `apps/api` | `apps/api/test/*.test.ts` | Vitest (Node) | `app.request(url, init, makeEnv())`; stub upstreams with `vi.stubGlobal("fetch", …)`; shared fixtures in `test/helpers.ts` |
| `packages/shared` | next to the source: `src/*.test.ts` | Vitest | plain schema/function tests |
| `apps/web` | `scripts/check-prerender.mjs` (runs as `pnpm test` after `pnpm build`) | Node | assertions on the prerendered HTML |

- **Every new API route or branch** (success, validation error, upstream failure, misconfig) gets a test.
- **Every bug fix** gets a test that fails without the fix.
- **Pure decision logic** (like `subscriberUpdate`) is tested directly, table-style, one case per row of its rules.
- **New pages or SEO rules** → extend `check-prerender.mjs` (content in `<main>`, canonical, robots, no public PDFs).
- Web unit tests don't exist yet. If one is needed, add Vitest + Testing Library to `apps/web` and put the test next to the component (`Component.test.tsx`).
- Tests never call real services: no real MailerLite, Turnstile or R2 — fakes only.
