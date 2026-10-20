---
description: Backend rules for the Hono API on Cloudflare Workers (apps/api).
paths:
  - "apps/api/**"
---

# API (Cloudflare Worker)

- **Workers runtime, not Node.** Use Web APIs (`fetch`, `crypto.subtle`, `Request`/`Response`). No `node:*` imports, no `Buffer`, no filesystem.
- **Routes** live in `src/routes/`, are mounted in `src/index.ts` under `/api`, and validate input with `zValidator` + a schema from `@coaching/shared`.
- **Config:** read every secret/var through `requireEnv` (`src/env.ts`). Missing config throws `ConfigError` → `500 server_misconfigured`. A new binding goes in `Bindings`, `wrangler.jsonc` (`vars`, or a secret), and `.env.example`.
- **Errors:** signup answers `{ ok: false, error, message }` (`SignupResponse`), other routes `{ error }`. Never leak upstream bodies or stack traces.
- **Logs:** no emails, tokens or API keys in `console.error`. (The dry-run log is local-only.)
- **Tests:** every new route or branch gets one (see `testing.md`).
- **Local dev:** `pnpm dev:backend` reads `apps/api/.env`; `MAILERLITE_DRY_RUN=true` there keeps MailerLite out. Never point local dev at the production MailerLite groups.
