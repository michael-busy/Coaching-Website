import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/index";
import { createDownloadToken } from "../src/services/tokens";
import { makeEnv, SECRET } from "./helpers";

const validBody = {
  email: "someone@example.com",
  consentOffers: false,
  resource: "four-goals",
  turnstileToken: "turnstile-token",
};

type FetchCall = { url: string; init: RequestInit | undefined };

/** Stub global fetch: Turnstile siteverify, DNS (MX), MailerLite subscriber lookup and upsert. */
function stubUpstreams(
  options: {
    turnstile?: boolean | "network-error";
    /** DNS answer for the email domain: a mail server (default) or no such domain. */
    dns?: "mx" | "nxdomain";
    existingStatus?: string | null;
    existingDownloads?: string | null;
    lookupStatus?: number;
    lookupBody?: unknown;
    upsertStatus?: number;
  } = {},
) {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : input.toString();
      calls.push({ url, init });
      if (url.includes("challenges.cloudflare.com")) {
        if (options.turnstile === "network-error") throw new TypeError("fetch failed");
        return Response.json({ success: options.turnstile ?? true });
      }
      if (url.startsWith("https://cloudflare-dns.com/dns-query")) {
        return options.dns === "nxdomain"
          ? Response.json({ Status: 3 })
          : Response.json({ Status: 0, Answer: [{ type: 15, data: "10 mx.example.com." }] });
      }
      if (url.startsWith("https://connect.mailerlite.com/api/subscribers/")) {
        if (options.lookupStatus) return Response.json({}, { status: options.lookupStatus });
        if (options.lookupBody !== undefined) return Response.json(options.lookupBody);
        const status = options.existingStatus ?? null;
        return status === null
          ? Response.json({ message: "Not found" }, { status: 404 })
          : Response.json({
              data: {
                id: "sub-1",
                status,
                fields: { downloads: options.existingDownloads ?? null },
              },
            });
      }
      if (url === "https://connect.mailerlite.com/api/subscribers") {
        return Response.json({ data: { id: "sub-1" } }, { status: options.upsertStatus ?? 201 });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    }),
  );
  return calls;
}

function upsertPayload(calls: FetchCall[]) {
  const upsert = calls.find(
    (call) => call.url === "https://connect.mailerlite.com/api/subscribers",
  );
  return upsert ? JSON.parse(String(upsert.init?.body)) : undefined;
}

function postSignup(body: unknown, env = makeEnv()) {
  return app.request(
    "https://example.com/api/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.7" },
      body: JSON.stringify(body),
    },
    env,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const res = await app.request("/api/health", {}, makeEnv());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});

describe("POST /api/signup", () => {
  it("returns a signed download link that works", async () => {
    stubUpstreams();
    const res = await postSignup(validBody);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; downloadUrl: string };
    expect(json.ok).toBe(true);
    expect(json.downloadUrl).toMatch(/^\/api\/downloads\/four-goals\?t=four-goals\.\d+\.[\w-]+$/);

    const download = await app.request(json.downloadUrl, {}, makeEnv());
    expect(download.status).toBe(200);
    expect(await download.text()).toBe("%PDF-1.7 four goals");
  });

  it("new subscriber with offers consent: unconfirmed, Downloads + Offers groups, consent evidence", async () => {
    const calls = stubUpstreams();
    await postSignup({ ...validBody, consentOffers: true });
    const payload = upsertPayload(calls);
    expect(payload).toMatchObject({
      email: "someone@example.com",
      status: "unconfirmed",
      groups: ["group-downloads", "group-offers"],
      ip_address: "203.0.113.7",
      fields: {
        downloads: "four-goals",
        last_download: "four-goals",
        marketing_consent: "yes",
        consent_text_version: "offers-v1",
      },
    });
    expect(payload.fields.marketing_consent_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    const lookup = calls.find((call) => call.url.includes("/subscribers/"));
    expect(lookup?.url).toBe(
      "https://connect.mailerlite.com/api/subscribers/someone%40example.com",
    );
  });

  it("new subscriber without offers consent: stored as unsubscribed, no Offers group", async () => {
    const calls = stubUpstreams();
    await postSignup(validBody);
    const payload = upsertPayload(calls);
    expect(payload).toMatchObject({
      status: "unsubscribed",
      groups: ["group-downloads"],
      fields: { downloads: "four-goals", last_download: "four-goals", marketing_consent: "no" },
    });
    expect(payload.fields).not.toHaveProperty("marketing_consent_at");
    expect(payload).not.toHaveProperty("ip_address");
  });

  it("existing active subscriber without consent: status and earlier consent untouched", async () => {
    const calls = stubUpstreams({ existingStatus: "active", upsertStatus: 200 });
    await postSignup({ ...validBody, resource: "unstuck" });
    const payload = upsertPayload(calls);
    expect(payload).not.toHaveProperty("status");
    expect(payload.groups).toEqual(["group-downloads"]);
    expect(payload.fields).toEqual({ downloads: "unstuck", last_download: "unstuck" });
  });

  it("existing subscriber keeps earlier downloads in the downloads field", async () => {
    const calls = stubUpstreams({
      existingStatus: "active",
      existingDownloads: "four-goals",
      upsertStatus: 200,
    });
    await postSignup({ ...validBody, resource: "unstuck" });
    expect(upsertPayload(calls).fields).toMatchObject({
      downloads: "four-goals,unstuck",
      last_download: "unstuck",
    });
  });

  it("existing unsubscribed subscriber who now consents is resubscribed via double opt-in", async () => {
    const calls = stubUpstreams({ existingStatus: "unsubscribed", upsertStatus: 200 });
    await postSignup({ ...validBody, consentOffers: true });
    expect(upsertPayload(calls)).toMatchObject({
      status: "unconfirmed",
      resubscribe: true,
      groups: ["group-downloads", "group-offers"],
    });
  });

  it("existing unconfirmed subscriber who ticks offers again is sent unconfirmed again", async () => {
    const calls = stubUpstreams({ existingStatus: "unconfirmed", upsertStatus: 200 });
    await postSignup({ ...validBody, consentOffers: true });
    const payload = upsertPayload(calls);
    expect(payload).toMatchObject({
      status: "unconfirmed",
      groups: ["group-downloads", "group-offers"],
    });
    expect(payload).not.toHaveProperty("resubscribe");
  });

  it("rejects an invalid email with 400 before any upstream call", async () => {
    const calls = stubUpstreams();
    const res = await postSignup({ ...validBody, email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_request" });
    expect(calls).toHaveLength(0);
  });

  it("rejects an unknown resource with 400", async () => {
    stubUpstreams();
    const res = await postSignup({ ...validBody, resource: "nope" });
    expect(res.status).toBe(400);
  });

  it("returns 403 when the bot check fails", async () => {
    const calls = stubUpstreams({ turnstile: false });
    const res = await postSignup(validBody);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ ok: false, error: "captcha_failed" });
    expect(calls.some((call) => call.url.includes("mailerlite"))).toBe(false);
  });

  it("rejects a throwaway inbox without looking up DNS or calling MailerLite", async () => {
    const calls = stubUpstreams();
    const res = await postSignup({ ...validBody, email: "someone@mailinator.com" });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_email" });
    expect(calls.some((call) => !call.url.includes("challenges.cloudflare.com"))).toBe(false);
  });

  it("rejects a domain that can't receive mail before calling MailerLite", async () => {
    const calls = stubUpstreams({ dns: "nxdomain" });
    const res = await postSignup({ ...validBody, email: "someone@no-such-domain.example" });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_email" });
    expect(calls.some((call) => call.url.includes("mailerlite"))).toBe(false);
  });

  it("checks the domain only after the bot check passes", async () => {
    const calls = stubUpstreams({ turnstile: false });
    await postSignup(validBody);
    expect(calls.some((call) => call.url.includes("cloudflare-dns.com"))).toBe(false);
  });

  it("maps a MailerLite validation error to 400 invalid_email", async () => {
    stubUpstreams({ upsertStatus: 422 });
    const res = await postSignup(validBody);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_email" });
  });

  it("maps a MailerLite outage to 502", async () => {
    stubUpstreams({ upsertStatus: 500 });
    const res = await postSignup(validBody);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, error: "upstream_error" });
  });

  it("maps MailerLite rate limiting to 503", async () => {
    stubUpstreams({ upsertStatus: 429 });
    const res = await postSignup(validBody);
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: "rate_limited" });
  });

  it("returns 502 without upserting when the subscriber lookup fails", async () => {
    const calls = stubUpstreams({ lookupStatus: 500 });
    expect((await postSignup(validBody)).status).toBe(502);
    expect(upsertPayload(calls)).toBeUndefined();
  });

  it("returns 502 when the subscriber lookup answers an unexpected body", async () => {
    const calls = stubUpstreams({ lookupBody: { data: {} } });
    expect((await postSignup(validBody)).status).toBe(502);
    expect(upsertPayload(calls)).toBeUndefined();
  });

  it("returns 500 internal_error when an upstream is unreachable", async () => {
    stubUpstreams({ turnstile: "network-error" });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await postSignup(validBody);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "internal_error" });
    error.mockRestore();
  });

  it("returns 500 when the link lifetime is missing or not positive", async () => {
    stubUpstreams();
    for (const ttl of ["", "0", "abc"]) {
      const res = await postSignup(validBody, makeEnv({ DOWNLOAD_LINK_TTL_HOURS: ttl }));
      expect(res.status).toBe(500);
    }
  });

  it("returns 429 when the rate limiter blocks the client", async () => {
    stubUpstreams();
    const env = makeEnv({
      SIGNUP_RATE_LIMITER: { limit: async () => ({ success: false }) } as unknown as RateLimit,
    });
    expect((await postSignup(validBody, env)).status).toBe(429);
  });

  it("returns 500 without calling MailerLite when the Downloads group is missing", async () => {
    const calls = stubUpstreams();
    const res = await postSignup(validBody, makeEnv({ MAILERLITE_DOWNLOADS_GROUP_ID: "" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server_misconfigured" });
    expect(calls.some((call) => call.url.includes("mailerlite"))).toBe(false);
  });

  it("skips MailerLite in dry-run mode but still returns the link", async () => {
    const calls = stubUpstreams();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const env = makeEnv({ MAILERLITE_DRY_RUN: "true", MAILERLITE_API_TOKEN: "" });
    const res = await postSignup({ ...validBody, consentOffers: true }, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
    expect(calls.some((call) => call.url.includes("mailerlite"))).toBe(false);
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("[dry run]"),
      expect.objectContaining({ groups: ["group-downloads", "group-offers"] }),
    );
    log.mockRestore();
  });
});

describe("GET /api/downloads/:slug", () => {
  const now = () => Math.floor(Date.now() / 1000);

  it("streams each resource for a valid token", async () => {
    for (const [slug, fileName] of [
      ["four-goals", "The-Four-Goals-Workbook.pdf"],
      ["unstuck", "Unstuck_Question_Toolkit_Worksheet.pdf"],
    ] as const) {
      const token = await createDownloadToken(SECRET, slug, now() + 60);
      const res = await app.request(`/api/downloads/${slug}?t=${token}`, {}, makeEnv());
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      expect(res.headers.get("Content-Disposition")).toContain(fileName);
      expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    }
  });

  it("does not accept a token for another resource", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now() + 60);
    const res = await app.request(`/api/downloads/four-goals?t=${token}`, {}, makeEnv());
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/resources/four-goals/?link=invalid");
  });

  it("redirects expired links back to the resource page", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now() - 60);
    const res = await app.request(`/api/downloads/unstuck?t=${token}`, {}, makeEnv());
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/resources/unstuck/?link=expired");
  });

  it("redirects missing or malformed tokens", async () => {
    for (const query of ["", "?t=unstuck.1.A"]) {
      const res = await app.request(`/api/downloads/unstuck${query}`, {}, makeEnv());
      expect(res.status).toBe(302);
      expect(res.headers.get("Location")).toBe("/resources/unstuck/?link=invalid");
    }
  });

  it("returns 404 when the file is missing from R2", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now() + 60);
    const env = makeEnv({ DOWNLOADS: { get: async () => null } as unknown as R2Bucket });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await app.request(`/api/downloads/unstuck?t=${token}`, {}, env);
    expect(res.status).toBe(404);
    expect(error).toHaveBeenCalledWith("Download missing from R2", { key: "unstuck.pdf" });
    error.mockRestore();
  });

  it("returns 404 for unknown resources", async () => {
    for (const slug of ["nope", "toString"]) {
      const res = await app.request(`/api/downloads/${slug}?t=x`, {}, makeEnv());
      expect(res.status).toBe(404);
    }
  });
});

describe("unknown API routes", () => {
  it("return JSON 404", async () => {
    const res = await app.request("/api/nope", {}, makeEnv());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});
