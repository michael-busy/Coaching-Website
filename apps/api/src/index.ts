import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { ConfigError, type AppEnv } from "./env";
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

// Only /api/* reaches the Worker (run_worker_first in wrangler.jsonc); all other paths are
// served from the static assets.
export default app;
