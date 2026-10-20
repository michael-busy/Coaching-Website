import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

const DEFAULT_BACKEND_URL = "http://localhost:8787";

/** BACKEND_URL from apps/web/.env (or the shell), validated so a typo fails at startup. */
function backendUrl(env: Record<string, string>): string {
  const value = env.BACKEND_URL?.trim() || DEFAULT_BACKEND_URL;
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(
      `BACKEND_URL must be an absolute URL such as ${DEFAULT_BACKEND_URL}, got "${value}"`,
    );
  }
}

/** Cloudflare's Turnstile test site keys (always pass / always block / force interactive). */
const TURNSTILE_TEST_KEY = /^[123]x0{20}A[ABF]$/;

/**
 * Deploy builds (REQUIRE_TURNSTILE_SITE_KEY=true) must carry the real Turnstile site key;
 * otherwise the site would ship the test key and every real signup would be rejected.
 */
function assertDeployableTurnstileKey(env: Record<string, string>) {
  if (env.REQUIRE_TURNSTILE_SITE_KEY !== "true") return;
  const key = env.VITE_TURNSTILE_SITE_KEY?.trim() ?? "";
  if (!key || TURNSTILE_TEST_KEY.test(key)) {
    throw new Error(
      "VITE_TURNSTILE_SITE_KEY must be set to the production Turnstile site key for deploy builds.",
    );
  }
}

export default defineConfig(({ command, mode }) => {
  // Empty prefix: also load non-VITE_ variables. They stay in this config (Node side) and are
  // not exposed to the browser bundle; only VITE_* variables are.
  const env = loadEnv(mode, import.meta.dirname, "");
  if (command === "build") assertDeployableTurnstileKey(env);

  return {
    plugins: [tailwindcss(), reactRouter()],
    define: {
      // Same value in the prerendered HTML and the client bundle (see SiteFooter).
      __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
    },
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 5180,
      // The browser always calls /api/* on this dev server, which forwards to BACKEND_URL
      // (the local Worker by default). In production the Worker serves the pages and the API
      // from the same origin, so no URL is needed there.
      proxy: {
        "/api": { target: backendUrl(env), changeOrigin: true },
      },
    },
  };
});
