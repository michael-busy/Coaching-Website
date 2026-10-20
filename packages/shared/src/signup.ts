import { z } from "zod";
import { GATED_RESOURCE_SLUGS } from "./resources";

export const signupRequestSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).max(254),
  consentEmail: z.literal(true, { error: "Please confirm that we may email you the worksheet." }),
  consentNewsletter: z.boolean(),
  resource: z.enum(GATED_RESOURCE_SLUGS),
  turnstileToken: z.string().min(1, { error: "Please complete the bot check." }),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const signupErrorCodes = [
  "invalid_request",
  "captcha_failed",
  "rate_limited",
  "upstream_error",
] as const;

export type SignupErrorCode = (typeof signupErrorCodes)[number];

export const signupResponseSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true) }),
  z.object({
    ok: z.literal(false),
    error: z.enum(signupErrorCodes),
    message: z.string(),
  }),
]);

export type SignupResponse = z.infer<typeof signupResponseSchema>;
