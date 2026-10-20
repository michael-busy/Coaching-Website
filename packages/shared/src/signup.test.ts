import { describe, expect, it } from "vitest";
import { RESOURCE_SLUGS, isResourceSlug } from "./resources";
import { signupRequestSchema, signupResponseSchema } from "./signup";

const valid = {
  email: "someone@example.com",
  consentOffers: false,
  resource: "four-goals",
  turnstileToken: "token",
};

describe("signupRequestSchema", () => {
  it("accepts a valid request with and without offers consent", () => {
    expect(signupRequestSchema.safeParse(valid).success).toBe(true);
    expect(signupRequestSchema.safeParse({ ...valid, consentOffers: true }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(signupRequestSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("requires an explicit offers choice", () => {
    const withoutChoice: Partial<typeof valid> = { ...valid };
    delete withoutChoice.consentOffers;
    expect(signupRequestSchema.safeParse(withoutChoice).success).toBe(false);
  });

  it("accepts every resource and rejects unknown ones", () => {
    for (const slug of RESOURCE_SLUGS) {
      expect(signupRequestSchema.safeParse({ ...valid, resource: slug }).success).toBe(true);
    }
    expect(signupRequestSchema.safeParse({ ...valid, resource: "nope" }).success).toBe(false);
  });
});

describe("signupResponseSchema", () => {
  it("requires a same-origin download link on success", () => {
    expect(
      signupResponseSchema.safeParse({ ok: true, downloadUrl: "/api/downloads/unstuck?t=x" })
        .success,
    ).toBe(true);
    expect(
      signupResponseSchema.safeParse({ ok: true, downloadUrl: "https://evil.example/x" }).success,
    ).toBe(false);
  });
});

describe("isResourceSlug", () => {
  it("does not match inherited object keys", () => {
    expect(isResourceSlug("unstuck")).toBe(true);
    expect(isResourceSlug("toString")).toBe(false);
  });
});
