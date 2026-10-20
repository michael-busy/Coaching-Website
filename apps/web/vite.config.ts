import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

const DEFAULT_BACKEND_URL = "http://localhost:8787";

/** Where the dev server proxies /api/* (BACKEND_URL in apps/web/.env). */
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

/** Cloudflare's Turnstile test site keys. */
const TURNSTILE_TEST_KEY = /^[123]x0{20}A[ABF]$/;

/** Deploy builds (REQUIRE_TURNSTILE_SITE_KEY=true) must not ship a test key. */
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
  // "" loads non-VITE_ vars too; only VITE_* reach the browser bundle.
  const env = loadEnv(mode, import.meta.dirname, "");
  if (command === "build") assertDeployableTurnstileKey(env);

  return {
    plugins: [tailwindcss(), reactRouter()],
    define: {
      __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
    },
    resolve: {
      tsconfigPaths: true,
    },
    // Pre-bundle every dependency when the dev server starts. Otherwise Vite finds them on the
    // first page visit, re-bundles and reloads, and a page opened meanwhile never hydrates
    // (the form and checkbox do nothing).
    optimizeDeps: {
      entries: ["app/**/*.tsx"],
    },
    server: {
      port: 5180,
      proxy: {
        "/api": { target: backendUrl(env), changeOrigin: true },
      },
    },
  };
});
