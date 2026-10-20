import { describe, expect, it } from "vitest";
import { mergeDownloads, subscriberUpdate } from "../src/services/mailerlite";

describe("subscriberUpdate", () => {
  it("new + offers: unconfirmed (double opt-in) and Offers group", () => {
    expect(subscriberUpdate(null, true)).toEqual({ status: "unconfirmed", addToOffers: true });
  });

  it("new + no offers: stored as unsubscribed, never emailed", () => {
    expect(subscriberUpdate(null, false)).toEqual({ status: "unsubscribed", addToOffers: false });
  });

  it("unsubscribed + offers: resubscribe through double opt-in", () => {
    expect(subscriberUpdate({ status: "unsubscribed" }, true)).toEqual({
      status: "unconfirmed",
      resubscribe: true,
      addToOffers: true,
    });
  });

  it("active / unconfirmed + offers: keep status, add Offers group", () => {
    for (const status of ["active", "unconfirmed", "bounced"]) {
      expect(subscriberUpdate({ status }, true)).toEqual({ addToOffers: true });
    }
  });

  it("existing + no offers: never touch the status", () => {
    for (const status of ["active", "unconfirmed", "unsubscribed"]) {
      expect(subscriberUpdate({ status }, false)).toEqual({ addToOffers: false });
    }
  });
});

describe("mergeDownloads", () => {
  it("starts the list for a first download", () => {
    expect(mergeDownloads(undefined, "unstuck")).toBe("unstuck");
  });

  it("appends a new resource and keeps earlier ones", () => {
    expect(mergeDownloads("four-goals", "unstuck")).toBe("four-goals,unstuck");
  });

  it("does not repeat a resource downloaded again", () => {
    expect(mergeDownloads("four-goals, unstuck", "four-goals")).toBe("four-goals,unstuck");
  });
});
