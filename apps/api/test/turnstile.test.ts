import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "../src/services/turnstile";

function stubSiteverify(response: Response) {
  const fetchMock = vi.fn(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  it("passes when Cloudflare answers success: true, sending secret, token and IP", async () => {
    const fetchMock = stubSiteverify(Response.json({ success: true }));
    expect(await verifyTurnstile("secret", "token", "203.0.113.7")).toBe(true);
    const body = (fetchMock.mock.calls[0] as unknown[])[1] as RequestInit;
    const form = body.body as FormData;
    expect([form.get("secret"), form.get("response"), form.get("remoteip")]).toEqual([
      "secret",
      "token",
      "203.0.113.7",
    ]);
  });

  it("fails when Cloudflare answers success: false", async () => {
    stubSiteverify(Response.json({ success: false }));
    expect(await verifyTurnstile("secret", "token", undefined)).toBe(false);
  });

  it("fails on an HTTP error or an unexpected body", async () => {
    stubSiteverify(new Response("oops", { status: 500 }));
    expect(await verifyTurnstile("secret", "token", undefined)).toBe(false);
    stubSiteverify(Response.json({ unexpected: true }));
    expect(await verifyTurnstile("secret", "token", undefined)).toBe(false);
    stubSiteverify(new Response("not json"));
    expect(await verifyTurnstile("secret", "token", undefined)).toBe(false);
  });
});
