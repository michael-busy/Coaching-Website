---
description: Adding, updating and pinning dependencies.
paths:
  - "package.json"
  - "apps/*/package.json"
  - "packages/*/package.json"
  - "pnpm-workspace.yaml"
  - "pnpm-lock.yaml"
---

# Dependencies

- **Add to the package that uses it:** `pnpm --filter @coaching/web add <pkg>` (or `@coaching/api`, `@coaching/shared`). Root `package.json` holds only repo-wide tooling (TypeScript, ESLint, Prettier).
- **Free and open source only** (MIT/Apache/BSD-style licences). No paid or trial UI kits.
- **Prefer what is already installed** before adding a package: zod, TanStack Query, react-hook-form, Radix (`radix-ui`), lucide-react, Tailwind. Don't add a library for something a few lines of code do.
- **API packages must run on Cloudflare Workers** (no Node built-ins, no native modules). Check before adding.
- **shadcn/ui components** are copied in with the CLI (`cd apps/web && pnpm dlx shadcn@latest add <name>`), not installed as a package.
- **Build scripts are blocked by default.** If a package needs one, approve it explicitly (`pnpm approve-builds <pkg>`), which adds it to `allowBuilds` in `pnpm-workspace.yaml`.
- **Pins:** TypeScript stays on `^6` until typescript-eslint supports TS 7. Upgrade one major version at a time and run the full verification.
- **Always commit `pnpm-lock.yaml`** with the `package.json` change, and keep `pnpm install --frozen-lockfile` passing (CI uses it).
