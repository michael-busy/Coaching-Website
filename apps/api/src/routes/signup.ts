import { zValidator } from "@hono/zod-validator";
import { signupRequestSchema, type SignupResponse } from "@coaching/shared";
import { Hono } from "hono";
import { requireEnv, type AppEnv } from "../env";
import { upsertSubscriber } from "../services/mailerlite";
import { createDownloadToken } from "../services/tokens";
import { verifyTurnstile } from "../services/turnstile";

const SECONDS_PER_DAY = 86_400;

function failure(
  error: Extract<SignupResponse, { ok: false }>["error"],
  message: string,
): SignupResponse {
  return { ok: false, error, message };
}

export const signup = new Hono<AppEnv>().post(
  "/",
  zValidator("json", signupRequestSchema, (result, c) => {
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid request.";
      return c.json(failure("invalid_request", message), 400);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const clientIp = c.req.header("CF-Connecting-IP");

    if (c.env.SIGNUP_RATE_LIMITER) {
      const { success } = await c.env.SIGNUP_RATE_LIMITER.limit({ key: clientIp ?? "unknown" });
      if (!success) {
        return c.json(
          failure("rate_limited", "Too many attempts. Please wait a minute and try again."),
          429,
        );
      }
    }

    const captchaOk = await verifyTurnstile(
      requireEnv(c.env, "TURNSTILE_SECRET_KEY"),
      body.turnstileToken,
      clientIp,
    );
    if (!captchaOk) {
      return c.json(failure("captcha_failed", "The bot check failed. Please try again."), 403);
    }

    const ttlDays = Number(c.env.DOWNLOAD_LINK_TTL_DAYS) || 14;
    const expiresAt = Math.floor(Date.now() / 1000) + ttlDays * SECONDS_PER_DAY;
    const token = await createDownloadToken(
      requireEnv(c.env, "DOWNLOAD_TOKEN_SECRET"),
      body.resource,
      expiresAt,
    );
    const downloadUrl = new URL(`/api/downloads/${body.resource}`, c.req.url);
    downloadUrl.searchParams.set("t", token);

    const groups = [requireEnv(c.env, "MAILERLITE_GROUP_ID")];
    if (body.consentNewsletter) groups.push(requireEnv(c.env, "MAILERLITE_NEWSLETTER_GROUP_ID"));

    const result = await upsertSubscriber({
      apiToken: requireEnv(c.env, "MAILERLITE_API_TOKEN"),
      email: body.email,
      groups,
      fields: { download_url: downloadUrl.toString() },
    });

    if (!result.ok) {
      console.error("MailerLite upsert failed", { status: result.status, kind: result.kind });
      if (result.kind === "invalid") {
        return c.json(failure("invalid_request", "That email address was not accepted."), 400);
      }
      if (result.kind === "rate_limited") {
        return c.json(
          failure("rate_limited", "Too many signups right now. Please try again shortly."),
          503,
        );
      }
      return c.json(
        failure("upstream_error", "The signup service is unavailable. Please try again later."),
        502,
      );
    }

    return c.json({ ok: true } satisfies SignupResponse, 200);
  },
);
