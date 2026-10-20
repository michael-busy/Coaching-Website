import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { BOOKING, OFFER_LINKS } from "~/lib/site";

const SCROLL_THRESHOLD = 80;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Whether the page is scrolled past the threshold (always false while prerendering). */
function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

export function SiteHeader() {
  const { pathname } = useLocation();
  // The home page has a full-screen video hero, so its header starts transparent.
  const transparent = pathname === "/";
  const scrolled = useScrolledPast(SCROLL_THRESHOLD);
  const [navOpen, setNavOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!offersOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) setOffersOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOffersOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [offersOpen]);

  function closeMenus() {
    setNavOpen(false);
    setOffersOpen(false);
  }

  const offersActive = pathname.startsWith("/offers/");

  return (
    <header
      className={transparent ? "site-header site-header--transparent" : "site-header"}
      data-scrolled={transparent ? String(scrolled) : undefined}
      data-nav-open={String(navOpen)}
    >
      <div className="container nav">
        <Link to="/" className="brand" onClick={closeMenus}>
          Chernyakov<span>.</span>Coaching
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          aria-expanded={navOpen}
          aria-controls="primary-nav"
          onClick={() => setNavOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
        <div className="nav-end">
          <nav id="primary-nav" className="nav-links" aria-label="Primary">
            <NavLink to="/" end onClick={closeMenus}>
              Home
            </NavLink>
            <NavLink to="/about-me/" onClick={closeMenus}>
              About me
            </NavLink>
            <div className="nav-dropdown" data-open={String(offersOpen)} ref={dropdownRef}>
              <button
                className={offersActive ? "nav-dropdown-toggle active" : "nav-dropdown-toggle"}
                type="button"
                aria-haspopup="true"
                aria-expanded={offersOpen}
                onClick={() => setOffersOpen((open) => !open)}
              >
                Offers{" "}
                <span className="caret" aria-hidden="true">
                  ▾
                </span>
              </button>
              <div className="nav-dropdown-menu">
                {OFFER_LINKS.map((offer) => (
                  <NavLink key={offer.to} to={offer.to} onClick={closeMenus}>
                    {offer.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink to="/resources/" onClick={closeMenus}>
              Resources
            </NavLink>
          </nav>
          <a className="nav-cta" href={BOOKING.call} target="_blank" rel="noopener noreferrer">
            Book a call
          </a>
        </div>
      </div>
    </header>
  );
}
