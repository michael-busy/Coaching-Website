import { describe, expect, it } from "vitest";
import { subscriberUpdate } from "../src/services/mailerlite";

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
