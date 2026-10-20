import { useSyncExternalStore } from "react";
import { Link } from "react-router";
import { CONTACT_EMAIL, SITE_NAME, mailto } from "~/lib/site";

const BUILD_YEAR = new Date().getFullYear();
const noopSubscribe = () => () => {};

/** Current year; the prerendered HTML has the build year and the client corrects it. */
function useCurrentYear(): number {
  return useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
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
