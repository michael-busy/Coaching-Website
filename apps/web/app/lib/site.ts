/** Single source of truth for contact details, booking links and third-party ids. */

export const SITE_URL = "https://chernyakov-coaching.com";
export const SITE_NAME = "Chernyakov Coaching";
export const CONTACT_EMAIL = "michael@chernyakov-coaching.com";

/**
 * Google Calendar booking pages. The old site used three different links; they are kept
 * as-is until the owner picks one (TODO.md §1). Then point all three keys at the same URL.
 */
export const BOOKING = {
  /** Header "Book a call" and the CTA bands on /guide/ and /resources/. */
  call: "https://calendar.app.google/iF25YMjAwqjbfpdF8",
  /** "Book an intro call" buttons on the about and offer pages. */
  intro: "https://calendar.app.google/MXdrHfJUWrtYFRPc9",
  /** Home page "Book your discovery session". */
  discovery: "https://calendar.app.google/o5aKAvfYqwtAx6nRA",
} as const;

export function mailto(subject?: string): string {
  return subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;
}

/** Umami Cloud (cookieless analytics). Public by design. */
export const UMAMI_WEBSITE_ID = "620375bf-ee3b-4be4-a532-98f35ceef0b4";

/**
 * Cloudflare Turnstile site key (public). Falls back to Cloudflare's always-pass test key so
 * local dev works; production builds set VITE_TURNSTILE_SITE_KEY (TODO.md §3).
 */
export const TURNSTILE_SITE_KEY: string =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export const OFFER_LINKS = [
  { to: "/offers/personal-coaching/", label: "Personal Coaching" },
  { to: "/offers/confidence-building/", label: "Confidence Building" },
  { to: "/offers/coaching-for-leaders/", label: "Coaching for Leaders" },
] as const;
