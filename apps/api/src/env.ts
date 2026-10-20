/** Bindings, secrets and vars available to the Worker (see wrangler.jsonc and .env.example). */
export interface Bindings {
  /** Static assets: the prerendered web app in apps/web/build/client. */
  ASSETS: Fetcher;
  /** Private R2 bucket holding the gated downloads. */
  DOWNLOADS: R2Bucket;
  /** Optional: Workers rate limiting binding for the signup endpoint. */
  SIGNUP_RATE_LIMITER?: RateLimit;

  // Secrets (wrangler secret put in production, apps/api/.env locally)
  MAILERLITE_API_TOKEN: string;
  TURNSTILE_SECRET_KEY: string;
  DOWNLOAD_TOKEN_SECRET: string;

  // Plain vars (wrangler.jsonc "vars")
  MAILERLITE_GROUP_ID: string;
  MAILERLITE_NEWSLETTER_GROUP_ID: string;
  DOWNLOAD_LINK_TTL_DAYS: string;

  /** Local development only (apps/api/.env): "true" skips MailerLite and logs the link. */
  MAILERLITE_DRY_RUN?: string;
}

export type AppEnv = { Bindings: Bindings };

export class ConfigError extends Error {
  override name = "ConfigError";
}

/** Read a required binding value, failing loudly when it is missing or empty. */
export function requireEnv<K extends keyof Bindings>(
  env: Bindings,
  key: K,
): NonNullable<Bindings[K]> {
  const value = env[key];
  if (value === undefined || value === null || value === "") {
    throw new ConfigError(`Missing required Worker configuration: ${String(key)}`);
  }
  return value as NonNullable<Bindings[K]>;
}
