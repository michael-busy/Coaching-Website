---
description: TypeScript conventions for all packages.
paths:
  - "apps/**/*.ts"
  - "apps/**/*.tsx"
  - "packages/**/*.ts"
---

# TypeScript

- **Strict config is shared** (`tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`). Don't loosen it per package.
- **Type-only imports** use `import type` / `type X` (enforced by ESLint `consistent-type-imports`).
- **No `any`**, no `as unknown as` outside tests, no non-null `!` — narrow with a check instead. Index access returns `T | undefined`; handle it.
- **Boundaries are validated, not cast:** request bodies, API responses and env JSON go through a zod schema (shared ones live in `packages/shared`).
- **Types come from one place:** API request/response types from `@coaching/shared`, route types from React Router's generated `./+types/<route>`. Don't redeclare them.
- **Exported service functions** (`apps/api/src/services/*`) declare their return type, e.g. `Promise<{ ok: true } | MailerLiteFailure>`; results are unions, not thrown errors.
- Use `satisfies` for config objects (`Config`, `RouteConfig`, response literals) so the literal type is kept.
- TypeScript stays on **6.x** until typescript-eslint supports TS 7 (see `dependencies.md`).
