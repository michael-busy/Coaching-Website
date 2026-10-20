const SUBSCRIBERS_URL = "https://connect.mailerlite.com/api/subscribers";

export type UpsertSubscriberResult =
  { ok: true } | { ok: false; kind: "invalid" | "rate_limited" | "upstream"; status: number };

/**
 * Create or update a MailerLite subscriber and add them to the given groups.
 *
 * Double opt-in is not requested here: it is applied by MailerLite itself when
 * "double opt-in for API and integrations" is enabled in the account (see TODO.md).
 */
export async function upsertSubscriber(options: {
  apiToken: string;
  email: string;
  groups: string[];
  fields: Record<string, string>;
}): Promise<UpsertSubscriberResult> {
  const response = await fetch(SUBSCRIBERS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: options.email,
      fields: options.fields,
      groups: options.groups,
    }),
  });

  if (response.status === 200 || response.status === 201) return { ok: true };
  if (response.status === 422) return { ok: false, kind: "invalid", status: response.status };
  if (response.status === 429) return { ok: false, kind: "rate_limited", status: response.status };
  return { ok: false, kind: "upstream", status: response.status };
}
