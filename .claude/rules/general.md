---
description: Repo-wide basics — pnpm, verification before "done", secrets, branches, docs that must move with the code.
---

# General

- **pnpm only** (version pinned in `package.json`). Never `npm` or `yarn`; never commit another lockfile.
- **Done means verified.** From the repo root, all of these pass:
  ```bash
  pnpm typecheck && pnpm lint && pnpm format:check && pnpm build && pnpm test
  ```
  `pnpm test` includes the prerender check, so run it after `pnpm build`.
- **No secrets in the repo.** Real values live in `apps/*/.env` (git-ignored) locally and in `wrangler secret put` / GitHub secrets in production. Only `.env.example` is committed, with safe defaults.
- **Never commit or push to `main`.** Work on a branch (`branch-naming.md`) and merge with a pull request. Until cutover, `main` is still the live site on GitHub Pages (`TODO.md` §7).
- **Docs move with the code**, in the same change:
  - new or renamed env var → `apps/*/.env.example`, `README.md` env table, `DEPLOY.md` if it is a production var;
  - new manual/dashboard step → `TODO.md`;
  - architecture decision → `docs/new_architecture_plan.md`.

Scoped rules (load when matching files are touched): `typescript.md`, `testing.md`, `dependencies.md`, `api-worker.md`, `web-pages.md`, `resources-and-consent.md`, `copy-and-legal.md`, `dns-and-email.md`.
