/**
 * Signed, expiring download tokens: `<slug>.<expiresAtUnixSeconds>.<base64url HMAC-SHA256>`.
 * The signature covers `<slug>.<expiresAt>`, so a token only unlocks the resource it was made for.
 */
const encoder = new TextEncoder();

export type TokenStatus = "valid" | "invalid" | "expired";

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  try {
    const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    // e.g. a length that is not valid base64 (length % 4 === 1)
    return null;
  }
}

export async function createDownloadToken(
  secret: string,
  slug: string,
  expiresAt: number,
): Promise<string> {
  const payload = `${slug}.${expiresAt}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret),
    encoder.encode(payload),
  );
  return `${payload}.${toBase64Url(signature)}`;
}

export async function verifyDownloadToken(
  secret: string,
  token: string,
  expectedSlug: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<TokenStatus> {
  const parts = token.split(".");
  if (parts.length !== 3) return "invalid";
  const [slug, expiresAtRaw, signatureRaw] = parts as [string, string, string];
  if (slug !== expectedSlug || !/^\d+$/.test(expiresAtRaw)) return "invalid";

  const signature = fromBase64Url(signatureRaw);
  if (!signature) return "invalid";

  // crypto.subtle.verify compares in constant time.
  const valid = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret),
    signature,
    encoder.encode(`${slug}.${expiresAtRaw}`),
  );
  if (!valid) return "invalid";

  return Number(expiresAtRaw) < nowSeconds ? "expired" : "valid";
}
