// Creates apps/*/.env from apps/*/.env.example when missing. Never overwrites an existing file.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

for (const app of ["api", "web"]) {
  const example = new URL(`apps/${app}/.env.example`, root);
  const target = new URL(`apps/${app}/.env`, root);
  if (existsSync(target)) continue;
  copyFileSync(example, target);
  console.log(`env:init: created ${fileURLToPath(target)} from .env.example`);
}
