const SUBSCRIBERS_URL = "https://connect.mailerlite.com/api/subscribers";

export type MailerLiteFailure = {
  ok: false;
  kind: "invalid" | "rate_limited" | "upstream";
  status: number;
};

export type UpsertSubscriberResult =
  { ok: true; created: boolean; subscriberId: string } | MailerLiteFailure;

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

/**
 * Create or update a MailerLite subscriber and add them to the given groups.
 * MailerLite answers 201 for a new subscriber and 200 for an existing one.
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
    headers: headers(options.apiToken),
    body: JSON.stringify({
      email: options.email,
      fields: options.fields,
      groups: options.groups,
    }),
  });

  if (response.status !== 200 && response.status !== 201) return failure(response.status);

  const body = (await response.json().catch(() => null)) as { data?: { id?: unknown } } | null;
  const id = body?.data?.id;
  if (typeof id !== "string" && typeof id !== "number") {
    return { ok: false, kind: "upstream", status: response.status };
  }
  return { ok: true, created: response.status === 201, subscriberId: String(id) };
}

/**
 * Remove and re-add a subscriber to a group. A "subscriber joins group" automation does not fire
 * for someone who is already in the group, so this makes a repeat signup (e.g. after an expired
 * link) send the download email again.
 */
export async function rejoinGroup(options: {
  apiToken: string;
  subscriberId: string;
  groupId: string;
}): Promise<{ ok: true } | MailerLiteFailure> {
  const url = `${SUBSCRIBERS_URL}/${encodeURIComponent(options.subscriberId)}/groups/${encodeURIComponent(options.groupId)}`;

  const removed = await fetch(url, { method: "DELETE", headers: headers(options.apiToken) });
  // 404: not in the group (anymore), which is fine before re-adding.
  if (!removed.ok && removed.status !== 404) return failure(removed.status);

  const added = await fetch(url, { method: "POST", headers: headers(options.apiToken) });
  if (!added.ok) return failure(added.status);
  return { ok: true };
}
