import { describe, expect, it } from "vitest";
import { signupRequestSchema } from "./signup";

const valid = {
  email: "someone@example.com",
  consentEmail: true,
  consentNewsletter: false,
  resource: "unstuck",
  turnstileToken: "token",
};

describe("signupRequestSchema", () => {
  it("accepts a valid request", () => {
    expect(signupRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(signupRequestSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("requires the email consent", () => {
    expect(signupRequestSchema.safeParse({ ...valid, consentEmail: false }).success).toBe(false);
  });

  it("rejects resources that are not gated", () => {
    expect(signupRequestSchema.safeParse({ ...valid, resource: "four-goals" }).success).toBe(false);
  });
});
