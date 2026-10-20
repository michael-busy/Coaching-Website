import { describe, expect, it } from "vitest";
import { createDownloadToken, verifyDownloadToken } from "../src/services/tokens";
import { SECRET } from "./helpers";

const now = 1_800_000_000;

describe("download tokens", () => {
  it("accepts a fresh token for the same resource", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now + 60);
    expect(await verifyDownloadToken(SECRET, token, "unstuck", now)).toBe("valid");
  });

  it("reports expired tokens", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now - 1);
    expect(await verifyDownloadToken(SECRET, token, "unstuck", now)).toBe("expired");
  });

  it("rejects a token for another resource", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now + 60);
    expect(await verifyDownloadToken(SECRET, token, "four-goals", now)).toBe("invalid");
  });

  it("rejects a token signed with another secret", async () => {
    const token = await createDownloadToken("other-secret", "unstuck", now + 60);
    expect(await verifyDownloadToken(SECRET, token, "unstuck", now)).toBe("invalid");
  });

  it("rejects a token whose expiry was tampered with", async () => {
    const token = await createDownloadToken(SECRET, "unstuck", now - 1);
    const [slug, , signature] = token.split(".");
    const tampered = `${slug}.${now + 9999}.${signature}`;
    expect(await verifyDownloadToken(SECRET, tampered, "unstuck", now)).toBe("invalid");
  });

  it("rejects malformed tokens", async () => {
    for (const token of ["", "abc", "unstuck.123", "unstuck.abc.def", "unstuck.123.!!!"]) {
      expect(await verifyDownloadToken(SECRET, token, "unstuck", now)).toBe("invalid");
    }
  });
});
