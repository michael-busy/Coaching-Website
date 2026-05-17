// Single source of truth for the booking URL and contact email.
// Update these constants in one place to roll new values to every page.
const BOOKING_URL = "https://calendar.app.google/MXdrHfJUWrtYFRPc9";
const CONTACT_EMAIL = "michael@chernyakov-coaching.com";

function applyDynamicLinks() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll('a[data-link="booking"]').forEach((a) => {
    a.href = BOOKING_URL;
  });

  document.querySelectorAll('a[data-link="email"]').forEach((a) => {
    const rawSubject = a.dataset.subject;
    const subject = rawSubject ? `?subject=${encodeURIComponent(rawSubject)}` : "";
    a.href = `mailto:${CONTACT_EMAIL}${subject}`;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyDynamicLinks);
} else {
  applyDynamicLinks();
}
