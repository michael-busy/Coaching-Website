---
description: How to name branches in this repo.
---

# Branch naming

Format: `<type>/<snake_case_description>` — lowercase, words joined with `_`, no spaces.

| Type | For |
|------|-----|
| `feat` | new behaviour visitors or the owner can see |
| `fix` | bug fixes |
| `content` | copy, images, PDFs, legal text |
| `chore` | tooling, dependencies, CI, config |
| `docs` | README, DEPLOY, TODO, `docs/` only |
| `refactor` | code changes with no behaviour change |

Examples: `feat/resource_download_pages`, `fix/footer_year_hydration`, `content/privacy_retention_period`.

- Branch from `main`, merge back with a pull request — never commit to `main` directly.
- Exception: `new_architecture_be_fe` (the migration branch) keeps its name until it is merged.
