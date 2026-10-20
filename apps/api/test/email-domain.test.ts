import { afterEach, describe, expect, it, vi } from "vitest";
import { checkEmailDomain } from "../src/services/email-domain";

type DnsReply = { Status: number; Answer?: { type: number; data: string }[] } | "error";

/** Stub DNS-over-HTTPS: one reply per record type; missing types answer NOERROR, no records. */
function stubDns(replies: Partial<Record<"MX" | "A" | "AAAA", DnsReply>>) {
  const queried: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      const type = url.searchParams.get("type") as "MX" | "A" | "AAAA";
      queried.push(type);
      const reply = replies[type] ?? { Status: 0 };
      if (reply === "error") return new Response("", { status: 502 });
      return Response.json(reply);
    }),
  );
  return queried;
}

const MX = { Status: 0, Answer: [{ type: 15, data: "10 mx.example.com." }] };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("checkEmailDomain", () => {
  it("accepts a domain with a mail server", async () => {
    stubDns({ MX });
    expect(await checkEmailDomain("a@Example.com")).toBe("ok");
  });

  it("rejects a domain that doesn't exist", async () => {
    stubDns({ MX: { Status: 3 } });
    expect(await checkEmailDomain("a@asdf.invalid")).toBe("no_mail");
  });

  it("rejects a null MX (the domain accepts no mail)", async () => {
    stubDns({ MX: { Status: 0, Answer: [{ type: 15, data: "0 ." }] } });
    expect(await checkEmailDomain("a@example.com")).toBe("no_mail");
  });

  it("accepts a domain without MX that has an address record", async () => {
    stubDns({ A: { Status: 0, Answer: [{ type: 1, data: "203.0.113.1" }] } });
    expect(await checkEmailDomain("a@example.com")).toBe("ok");
  });

  it("ignores CNAME answers when looking for MX records", async () => {
    const queried = stubDns({
      MX: { Status: 0, Answer: [{ type: 5, data: "alias.example.com." }] },
      AAAA: { Status: 0, Answer: [{ type: 28, data: "2001:db8::1" }] },
    });
    expect(await checkEmailDomain("a@example.com")).toBe("ok");
    expect(queried).toEqual(["MX", "A", "AAAA"]);
  });

  it("rejects a domain with no MX and no address", async () => {
    stubDns({});
    expect(await checkEmailDomain("a@example.com")).toBe("no_mail");
  });

  it("rejects throwaway inboxes, including subdomains, without a DNS lookup", async () => {
    const queried = stubDns({ MX });
    expect(await checkEmailDomain("a@mailinator.com")).toBe("disposable");
    expect(await checkEmailDomain("a@inbox.mailinator.com")).toBe("disposable");
    expect(queried).toEqual([]);
  });

  it("fails open when DNS errors, times out or answers SERVFAIL", async () => {
    stubDns({ MX: "error" });
    expect(await checkEmailDomain("a@example.com")).toBe("ok");
    stubDns({ MX: { Status: 2 } });
    expect(await checkEmailDomain("a@example.com")).toBe("ok");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("timeout", "TimeoutError")));
    expect(await checkEmailDomain("a@example.com")).toBe("ok");
  });
});
