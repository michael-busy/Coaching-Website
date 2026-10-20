import { disposableEmailBlocklist } from "disposable-email-domains-js";
import { z } from "zod";

const DOH_URL = "https://cloudflare-dns.com/dns-query";
const DNS_TIMEOUT_MS = 2_500;
const NXDOMAIN = 3;
const RECORD_TYPE = { A: 1, MX: 15, AAAA: 28 } as const;

const DISPOSABLE_DOMAINS = new Set(disposableEmailBlocklist());

const dohResponseSchema = z.object({
  Status: z.number(),
  Answer: z.array(z.object({ type: z.number(), data: z.string() })).optional(),
});

type DnsAnswer = z.infer<typeof dohResponseSchema>;

export type EmailDomainCheck = "ok" | "disposable" | "no_mail";

/** The domain, or any parent domain, is a known throwaway-inbox provider. */
function isDisposable(domain: string): boolean {
  const labels = domain.split(".");
  for (let i = 0; i < labels.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(labels.slice(i).join("."))) return true;
  }
  return false;
}

/** DNS-over-HTTPS lookup; null when the resolver can't answer (timeout, error, bad body). */
async function lookup(domain: string, type: keyof typeof RECORD_TYPE): Promise<DnsAnswer | null> {
  try {
    const response = await fetch(`${DOH_URL}?${new URLSearchParams({ name: domain, type })}`, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(DNS_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const body = dohResponseSchema.safeParse(await response.json());
    // Only NOERROR (0) and NXDOMAIN (3) are real answers; SERVFAIL and the rest are unknown.
    if (!body.success || (body.data.Status !== 0 && body.data.Status !== NXDOMAIN)) return null;
    return body.data;
  } catch {
    return null;
  }
}

function records(answer: DnsAnswer, type: keyof typeof RECORD_TYPE) {
  return (answer.Answer ?? []).filter((record) => record.type === RECORD_TYPE[type]);
}

/**
 * Can the address's domain receive mail? Rejects throwaway-inbox domains and domains with no
 * mail server. Fails open: if DNS can't be reached, the address is accepted.
 */
export async function checkEmailDomain(email: string): Promise<EmailDomainCheck> {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (isDisposable(domain)) return "disposable";

  const mx = await lookup(domain, "MX");
  if (!mx) return "ok";
  if (mx.Status === NXDOMAIN) return "no_mail";
  const mxRecords = records(mx, "MX");
  if (mxRecords.length > 0) {
    // "0 ." is a null MX (RFC 7505): the domain declares it accepts no mail.
    return mxRecords.every((record) => /^0\s+\.$/.test(record.data.trim())) ? "no_mail" : "ok";
  }

  // No MX record: mail goes to the domain's own address (RFC 5321 §5.1).
  for (const type of ["A", "AAAA"] as const) {
    const address = await lookup(domain, type);
    if (!address || records(address, type).length > 0) return "ok";
  }
  return "no_mail";
}
