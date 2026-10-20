import { useSyncExternalStore } from "react";
import { Link } from "react-router";
import { CONTACT_EMAIL, SITE_NAME, mailto } from "~/lib/site";

const noopSubscribe = () => () => {};

/**
 * Current year. The prerendered HTML contains the build year (__BUILD_YEAR__, injected by
 * vite.config.ts into both the server and client bundles), so hydration always matches; the
 * client then switches to the visitor's current year if it differs.
 */
function useCurrentYear(): number {
  return useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => __BUILD_YEAR__,
  );
}

export function SiteFooter() {
  const year = useCurrentYear();
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          © {year} {SITE_NAME}
        </div>
        <div className="footer-links">
          <a href={mailto()}>{CONTACT_EMAIL}</a>
          <Link to="/privacy/">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
