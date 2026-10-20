import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/index";
import { createDownloadToken } from "../src/services/tokens";
import { makeEnv, SECRET } from "./helpers";

const validBody = {
  email: "someone@example.com",
  consentEmail: true,
  consentNewsletter: false,
  resource: "unstuck",
  turnstileToken: "turnstile-token",
};

type FetchCall = { url: string; init: RequestInit | undefined };

/** Stub global fetch: Turnstile siteverify and MailerLite subscribers. */
function stubUpstreams(options: { turnstile?: boolean; mailerliteStatus?: number } = {}) {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : input.toString();
      calls.push({ url, init });
      if (url.includes("challenges.cloudflare.com")) {
        return Response.json({ success: options.turnstile ?? true });
      }
      if (url.includes("connect.mailerlite.com")) {
        return Response.json({}, { status: options.mailerliteStatus ?? 201 });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    }),
  );
  return calls;
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
  it("creates the subscriber with a signed download link", async () => {
    const calls = stubUpstreams();
    const res = await postSignup(validBody);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const mailerlite = calls.find((call) => call.url.includes("mailerlite"));
    expect(mailerlite?.init?.headers).toMatchObject({ Authorization: "Bearer ml-token" });
    const payload = JSON.parse(String(mailerlite?.init?.body));
    expect(payload.email).toBe("someone@example.com");
    expect(payload.groups).toEqual(["group-worksheet"]);
    expect(payload.fields.download_url).toMatch(
      /^https:\/\/example\.com\/api\/downloads\/unstuck\?t=unstuck\.\d+\.[\w-]+$/,
    );
  });

  it("adds the newsletter group only with newsletter consent", async () => {
    const calls = stubUpstreams();
    await postSignup({ ...validBody, consentNewsletter: true });
    const mailerlite = calls.find((call) => call.url.includes("mailerlite"));
    expect(JSON.parse(String(mailerlite?.init?.body)).groups).toEqual([
      "group-worksheet",
      "group-newsletter",
    ]);
  });

  it("rejects an invalid email with 400", async () => {
    const calls = stubUpstreams();
    const res = await postSignup({ ...validBody, email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_request" });
    expect(calls).toHaveLength(0);
  });

  it("rejects a missing email consent with 400", async () => {
    stubUpstreams();
    const res = await postSignup({ ...validBody, consentEmail: false });
    expect(res.status).toBe(400);
  });

  it("returns 403 when the bot check fails", async () => {
    const calls = stubUpstreams({ turnstile: false });
    const res = await postSignup(validBody);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ ok: false, error: "captcha_failed" });
    expect(calls.some((call) => call.url.includes("mailerlite"))).toBe(false);
  });

  it("maps a MailerLite validation error to 400", async () => {
    stubUpstreams({ mailerliteStatus: 422 });
    const res = await postSignup(validBody);
    expect(res.status).toBe(400);
  });

  it("maps a MailerLite outage to 502", async () => {
    stubUpstreams({ mailerliteStatus: 500 });
    const res = await postSignup(validBody);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, error: "upstream_error" });
  });

  it("returns 429 when the rate limiter blocks the client", async () => {
    stubUpstreams();
    const env = makeEnv({
      SIGNUP_RATE_LIMITER: { limit: async () => ({ success: false }) } as unknown as RateLimit,
    });
    const res = await postSignup(validBody, env);
    expect(res.status).toBe(429);
  });

  it("returns 500 when configuration is missing", async () => {
    stubUpstreams();
    const res = await postSignup(validBody, makeEnv({ MAILERLITE_GROUP_ID: "" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server_misconfigured" });
  });
});

describe("GET /api/downloads/:slug", () => {
  it("streams the PDF for a valid token", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", Math.floor(Date.now() / 1000) + 60);
    const res = await app.request(`/api/downloads/unstuck?t=${token}`, {}, makeEnv());
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain(
      "Unstuck_Question_Toolkit_Worksheet.pdf",
    );
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await res.text()).toBe("%PDF-1.7 test");
  });

  it("redirects expired links back to the signup page", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", Math.floor(Date.now() / 1000) - 60);
    const res = await app.request(`/api/downloads/unstuck?t=${token}`, {}, makeEnv());
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/guide/?link=expired");
  });

  it("redirects invalid or missing tokens", async () => {
    const res = await app.request("/api/downloads/unstuck", {}, makeEnv());
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/guide/?link=invalid");
  });

  it("returns 404 for resources that are not gated", async () => {
    const res = await app.request("/api/downloads/four-goals?t=x", {}, makeEnv());
    expect(res.status).toBe(404);
  });
});

describe("unknown API routes", () => {
  it("return JSON 404", async () => {
    const res = await app.request("/api/nope", {}, makeEnv());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});
