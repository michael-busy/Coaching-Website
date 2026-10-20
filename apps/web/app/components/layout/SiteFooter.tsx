import { Link } from "react-router";
import { useHydrated } from "~/hooks/use-hydrated";
import { CONTACT_EMAIL, SITE_NAME, mailto } from "~/lib/site";

export function SiteFooter() {
  // Prerendered HTML has the build year; after hydration the visitor's current year.
  const year = useHydrated() ? new Date().getFullYear() : __BUILD_YEAR__;
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
