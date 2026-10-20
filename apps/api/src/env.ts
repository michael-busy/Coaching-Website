/** Worker bindings, secrets and vars (see wrangler.jsonc and .env.example). */
export interface Bindings {
  /** Private R2 bucket with the downloadable PDFs. */
  DOWNLOADS: R2Bucket;
  SIGNUP_RATE_LIMITER?: RateLimit;

  // Secrets
  MAILERLITE_API_TOKEN: string;
  TURNSTILE_SECRET_KEY: string;
  DOWNLOAD_TOKEN_SECRET: string;

  // Vars
  /** MailerLite group every downloader joins; the `downloads` field says what they got. */
  MAILERLITE_DOWNLOADS_GROUP_ID: string;
  MAILERLITE_OFFERS_GROUP_ID: string;
  DOWNLOAD_LINK_TTL_HOURS: string;
  /** Local dev only: "true" skips MailerLite and logs the payload. */
  MAILERLITE_DRY_RUN?: string;
}

export type AppEnv = { Bindings: Bindings };

export class ConfigError extends Error {
  override name = "ConfigError";
}

/** DOWNLOAD_LINK_TTL_HOURS as a positive number of seconds. */
export function downloadLinkTtlSeconds(env: Bindings): number {
  const hours = Number(requireEnv(env, "DOWNLOAD_LINK_TTL_HOURS"));
  if (!(hours > 0)) throw new ConfigError("DOWNLOAD_LINK_TTL_HOURS must be a positive number");
  return hours * 3_600;
}

/** A required binding; throws ConfigError when missing or empty. */
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
