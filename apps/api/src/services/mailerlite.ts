import { z } from "zod";

const SUBSCRIBERS_URL = "https://connect.mailerlite.com/api/subscribers";

export type MailerLiteFailure = {
  ok: false;
  kind: "invalid" | "rate_limited" | "upstream";
  status: number;
};

const subscriberResponseSchema = z.object({
  data: z.object({
    /** active | unsubscribed | unconfirmed | bounced | junk */
    status: z.string(),
    fields: z.object({ downloads: z.string().nullish() }).optional(),
  }),
});

export type ExistingSubscriber = {
  status: string;
  /** The `downloads` field: comma-separated resource slugs. */
  downloads?: string;
};

function headers(apiToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function failure(status: number): MailerLiteFailure {
  if (status === 422) return { ok: false, kind: "invalid", status };
  if (status === 429) return { ok: false, kind: "rate_limited", status };
  return { ok: false, kind: "upstream", status };
}

/** `subscriber` is null when the email is not in MailerLite yet. */
export async function getSubscriber(options: {
  apiToken: string;
  email: string;
}): Promise<{ ok: true; subscriber: ExistingSubscriber | null } | MailerLiteFailure> {
  const response = await fetch(`${SUBSCRIBERS_URL}/${encodeURIComponent(options.email)}`, {
    headers: headers(options.apiToken),
  });
  if (response.status === 404) return { ok: true, subscriber: null };
  if (!response.ok) return failure(response.status);

  const body = subscriberResponseSchema.safeParse(await response.json().catch(() => null));
  if (!body.success) return { ok: false, kind: "upstream", status: response.status };
  const { status, fields } = body.data.data;
  return {
    ok: true,
    subscriber: fields?.downloads ? { status, downloads: fields.downloads } : { status },
  };
}

/** Adds `slug` to a comma-separated `downloads` field value, keeping earlier downloads. */
export function mergeDownloads(existing: string | undefined, slug: string): string {
  const slugs = (existing ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return (slugs.includes(slug) ? slugs : [...slugs, slug]).join(",");
}

export type SubscriberUpdate = {
  /** Omitted when the existing status must be kept. */
  status?: "unconfirmed" | "unsubscribed";
  resubscribe?: true;
  addToOffers: boolean;
};

/**
 * How a download signup changes the subscriber (status table in docs/new_architecture_plan.md):
 * `unconfirmed` triggers MailerLite's double opt-in email; `unsubscribed` stores the email but
 * MailerLite never emails it; an existing subscriber without consent is left untouched.
 */
export function subscriberUpdate(
  existing: ExistingSubscriber | null,
  consentOffers: boolean,
): SubscriberUpdate {
  if (!consentOffers) {
    return existing ? { addToOffers: false } : { status: "unsubscribed", addToOffers: false };
  }
  if (!existing) return { status: "unconfirmed", addToOffers: true };
  if (existing.status === "unsubscribed") {
    return { status: "unconfirmed", resubscribe: true, addToOffers: true };
  }
  return { addToOffers: true };
}

/** Create (201) or update (200) a subscriber. Omitted groups and fields are kept. */
export async function upsertSubscriber(options: {
  apiToken: string;
  email: string;
  groups: string[];
  fields: Record<string, string>;
  status?: SubscriberUpdate["status"];
  resubscribe?: true;
  ipAddress?: string;
}): Promise<{ ok: true } | MailerLiteFailure> {
  const response = await fetch(SUBSCRIBERS_URL, {
    method: "POST",
    headers: headers(options.apiToken),
    body: JSON.stringify({
      email: options.email,
      fields: options.fields,
      groups: options.groups,
      ...(options.status ? { status: options.status } : {}),
      ...(options.resubscribe ? { resubscribe: true } : {}),
      ...(options.ipAddress ? { ip_address: options.ipAddress } : {}),
    }),
  });

  if (response.status === 200 || response.status === 201) return { ok: true };
  return failure(response.status);
}
