import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { RESOURCE_SLUGS } from "@coaching/shared";
import type { Config } from "@react-router/dev/config";

/** Every marketing page is prerendered to static HTML at build time (no server rendering). */
export const PRERENDER_PATHS = [
  "/",
  "/about-me/",
  "/offers/",
  "/offers/personal-coaching/",
  "/offers/confidence-building/",
  "/offers/coaching-for-leaders/",
  "/resources/",
  ...RESOURCE_SLUGS.map((slug) => `/resources/${slug}/`),
  "/privacy/",
  // Rendered by the catch-all route; copied to build/client/404.html by scripts/postbuild.mjs.
  "/404",
];

export default {
  ssr: false,
  prerender: PRERENDER_PATHS,
  // scripts/check-prerender.mjs reads this list instead of importing this TypeScript file.
  async buildEnd({ reactRouterConfig }) {
    await writeFile(
      join(reactRouterConfig.buildDirectory, "prerender-paths.json"),
      JSON.stringify(PRERENDER_PATHS, null, 2),
    );
  },
} satisfies Config;
