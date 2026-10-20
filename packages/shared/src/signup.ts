import { z } from "zod";
import { resourceSlugSchema } from "./resources";

/**
 * Version of the offers consent wording shown next to the checkbox. Stored with the subscriber
 * as consent evidence; bump it whenever the wording in SignupForm changes.
 */
export const OFFERS_CONSENT_VERSION = "offers-v1";

export const signupRequestSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).max(254),
  /** Optional, separate consent to receive offers by email. The download never depends on it. */
  consentOffers: z.boolean(),
  resource: resourceSlugSchema,
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
  z.object({
    ok: z.literal(true),
    /** Signed, expiring same-origin link, e.g. /api/downloads/four-goals?t=… */
    downloadUrl: z.string().startsWith("/api/downloads/"),
  }),
  z.object({
    ok: z.literal(false),
    error: z.enum(signupErrorCodes),
    message: z.string(),
  }),
]);

export type SignupResponse = z.infer<typeof signupResponseSchema>;
