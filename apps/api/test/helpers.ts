import type { Bindings } from "../src/env";

export const SECRET = "test-download-secret";

export function makeEnv(overrides: Partial<Bindings> = {}): Bindings {
  const objects = new Map<string, string>([["unstuck.pdf", "%PDF-1.7 test"]]);
  const bucket = {
    async get(key: string) {
      const content = objects.get(key);
      if (content === undefined) return null;
      return {
        body: new Response(content).body,
        httpEtag: '"etag"',
        httpMetadata: { contentType: "application/pdf" },
      };
    },
  };

  return {
    ASSETS: { fetch: async () => new Response("asset") } as unknown as Fetcher,
    DOWNLOADS: bucket as unknown as R2Bucket,
    MAILERLITE_API_TOKEN: "ml-token",
    MAILERLITE_GROUP_ID: "group-worksheet",
    MAILERLITE_NEWSLETTER_GROUP_ID: "group-newsletter",
    TURNSTILE_SECRET_KEY: "turnstile-secret",
    DOWNLOAD_TOKEN_SECRET: SECRET,
    DOWNLOAD_LINK_TTL_DAYS: "14",
    ...overrides,
  };
}
