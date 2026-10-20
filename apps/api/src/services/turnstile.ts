const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Verify a Cloudflare Turnstile token server-side. */
export async function verifyTurnstile(
  secret: string,
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  const response = await fetch(SITEVERIFY_URL, { method: "POST", body });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
