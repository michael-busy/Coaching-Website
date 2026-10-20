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
  "/guide/",
  "/privacy/",
  // Rendered by the catch-all route; copied to build/client/404.html by scripts/postbuild.mjs.
  "/404",
];

export default {
  ssr: false,
  prerender: PRERENDER_PATHS,
} satisfies Config;
