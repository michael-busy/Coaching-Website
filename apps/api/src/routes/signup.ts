import { zValidator } from "@hono/zod-validator";
import { OFFERS_CONSENT_VERSION, signupRequestSchema, type SignupResponse } from "@coaching/shared";
import { Hono } from "hono";
import { downloadLinkTtlSeconds, requireEnv, type AppEnv } from "../env";
import { checkEmailDomain, type EmailDomainCheck } from "../services/email-domain";
import {
  getSubscriber,
  mergeDownloads,
  subscriberUpdate,
  upsertSubscriber,
  type ExistingSubscriber,
} from "../services/mailerlite";
import { createDownloadToken } from "../services/tokens";
import { verifyTurnstile } from "../services/turnstile";

function failure(
  error: Extract<SignupResponse, { ok: false }>["error"],
  message: string,
): SignupResponse {
  return { ok: false, error, message };
}

const EMAIL_DOMAIN_MESSAGES: Record<Exclude<EmailDomainCheck, "ok">, string> = {
  disposable: "Please use your regular email address. Temporary inboxes can't be used.",
  no_mail: "That email address can't receive mail. Please check it for typos.",
};

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

    // After the bot check, so the endpoint can't be used to probe domains.
    const emailDomain = await checkEmailDomain(body.email);
    if (emailDomain !== "ok") {
      return c.json(failure("invalid_email", EMAIL_DOMAIN_MESSAGES[emailDomain]), 400);
    }

    // Resolve config and sign the link before touching MailerLite, so a misconfiguration never
    // leaves a subscriber stored without a download.
    const token = await createDownloadToken(
      requireEnv(c.env, "DOWNLOAD_TOKEN_SECRET"),
      body.resource,
      Math.floor(Date.now() / 1000) + downloadLinkTtlSeconds(c.env),
    );
    const downloadUrl = `/api/downloads/${body.resource}?${new URLSearchParams({ t: token })}`;
    const downloadsGroup = requireEnv(c.env, "MAILERLITE_DOWNLOADS_GROUP_ID");
    const offersGroup = body.consentOffers ? requireEnv(c.env, "MAILERLITE_OFFERS_GROUP_ID") : null;

    const upsertPayload = (existing: ExistingSubscriber | null) => {
      const update = subscriberUpdate(existing, body.consentOffers);
      const fields: Record<string, string> = {
        downloads: mergeDownloads(existing?.downloads, body.resource),
        last_download: body.resource,
      };
      if (body.consentOffers) {
        fields.marketing_consent = "yes";
        fields.marketing_consent_at = new Date().toISOString();
        fields.consent_text_version = OFFERS_CONSENT_VERSION;
      } else if (!existing) {
        // Only new subscribers get "no": never overwrite an earlier "yes".
        fields.marketing_consent = "no";
      }
      return {
        email: body.email,
        groups: [downloadsGroup, ...(update.addToOffers && offersGroup ? [offersGroup] : [])],
        fields,
        status: update.status,
        resubscribe: update.resubscribe,
        // Consent evidence only (privacy policy §8): a plain download doesn't store the IP.
        ipAddress: body.consentOffers ? clientIp : undefined,
      };
    };

    if (c.env.MAILERLITE_DRY_RUN === "true") {
      console.log("[dry run] MailerLite skipped. Would upsert:", upsertPayload(null));
      return c.json({ ok: true, downloadUrl } satisfies SignupResponse, 200);
    }

    const apiToken = requireEnv(c.env, "MAILERLITE_API_TOKEN");
    const lookup = await getSubscriber({ apiToken, email: body.email });
    const result = lookup.ok
      ? await upsertSubscriber({ apiToken, ...upsertPayload(lookup.subscriber) })
      : lookup;

    if (!result.ok) {
      console.error("MailerLite request failed", { status: result.status, kind: result.kind });
      if (result.kind === "invalid") {
        return c.json(failure("invalid_email", "That email address was not accepted."), 400);
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

    return c.json({ ok: true, downloadUrl } satisfies SignupResponse, 200);
  },
);
