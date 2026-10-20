export const SITE_URL = "https://chernyakov-coaching.com";
export const SITE_NAME = "Chernyakov Coaching";
export const CONTACT_EMAIL = "michael@chernyakov-coaching.com";

/** Google Calendar booking pages. Three are live until the owner picks one (TODO.md §1). */
export const BOOKING = {
  /** Header and resource pages. */
  call: "https://calendar.app.google/iF25YMjAwqjbfpdF8",
  /** About and offer pages. */
  intro: "https://calendar.app.google/MXdrHfJUWrtYFRPc9",
  /** Home page. */
  discovery: "https://calendar.app.google/o5aKAvfYqwtAx6nRA",
} as const;

export function mailto(subject?: string): string {
  return subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;
}

/** Umami Cloud analytics (public id). */
export const UMAMI_WEBSITE_ID = "620375bf-ee3b-4be4-a532-98f35ceef0b4";

/** Public Turnstile site key; defaults to Cloudflare's always-pass test key for local dev. */
export const TURNSTILE_SITE_KEY: string =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export const OFFER_LINKS = [
  { to: "/offers/personal-coaching/", label: "Personal Coaching" },
  { to: "/offers/confidence-building/", label: "Confidence Building" },
  { to: "/offers/coaching-for-leaders/", label: "Coaching for Leaders" },
] as const;
