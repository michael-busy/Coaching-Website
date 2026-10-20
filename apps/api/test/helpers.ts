import type { Bindings } from "../src/env";

export const SECRET = "test-download-secret";

export function makeEnv(overrides: Partial<Bindings> = {}): Bindings {
  const objects = new Map<string, string>([
    ["four-goals.pdf", "%PDF-1.7 four goals"],
    ["unstuck.pdf", "%PDF-1.7 unstuck"],
  ]);
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
    DOWNLOADS: bucket as unknown as R2Bucket,
    MAILERLITE_API_TOKEN: "ml-token",
    MAILERLITE_RESOURCE_GROUP_IDS: JSON.stringify({
      "four-goals": "group-four-goals",
      unstuck: "group-unstuck",
    }),
    MAILERLITE_OFFERS_GROUP_ID: "group-offers",
    TURNSTILE_SECRET_KEY: "turnstile-secret",
    DOWNLOAD_TOKEN_SECRET: SECRET,
    DOWNLOAD_LINK_TTL_HOURS: "24",
    ...overrides,
  };
}
