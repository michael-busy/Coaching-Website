import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { ConfigError, type AppEnv, type Bindings } from "./env";
import { downloads } from "./routes/downloads";
import { health } from "./routes/health";
import { signup } from "./routes/signup";

export const app = new Hono<AppEnv>()
  .basePath("/api")
  .use(secureHeaders())
  .route("/health", health)
  .route("/signup", signup)
  .route("/downloads", downloads);

app.notFound((c) => c.json({ error: "not_found" }, 404));

app.onError((err, c) => {
  console.error(err);
  if (err instanceof ConfigError) return c.json({ error: "server_misconfigured" }, 500);
  return c.json({ error: "internal_error" }, 500);
});

export default {
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return app.fetch(request, env, ctx);
    }
    // Only /api/* runs the Worker first (wrangler.jsonc); everything else is static assets.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Bindings>;
