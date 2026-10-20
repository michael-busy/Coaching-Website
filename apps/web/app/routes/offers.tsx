import { Link } from "react-router";
import type { Route } from "./+types/offers";
import { BOOKING, mailto } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Offers — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "Coaching offerings — one-on-one coaching and coaching workshops for leadership teams.",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://chernyakov-coaching.com/offers/",
  },
];

export default function Offers() {
  return (
    <>
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="container">
          <span className="eyebrow">Offers</span>
          <h1>Two ways to work together</h1>
          <p className="lead">
            Whether you're an individual ready to grow or a company looking to develop your leaders,
            the work starts the same way: with honest conversation and a clear plan.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="services">
            <article className="service">
              <div className="icon" aria-hidden="true">
                1:1
              </div>
              <h3>Personal Coaching</h3>
              <p>
                Get your thoughts and mind in order. Structured coaching grounded in the GROW
                framework and ICF ethical standards, for a clear action forward.
              </p>
              <div className="service-actions">
                <Link className="btn btn-primary" to="/offers/personal-coaching/">
                  Learn more
                </Link>
                <a
                  className="btn btn-secondary"
                  href={BOOKING.intro}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book an intro call
                </a>
              </div>
            </article>

            <article className="service">
              <div className="icon" aria-hidden="true">
                ▲
              </div>
              <h3>Confidence Building</h3>
              <p>
                Confidence is a skill, not a trait. Build it through control, appearance, posture,
                attitude and leadership — with real practice and reflection.
              </p>
              <div className="service-actions">
                <Link className="btn btn-primary" to="/offers/confidence-building/">
                  Learn more
                </Link>
                <a
                  className="btn btn-secondary"
                  href={BOOKING.intro}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book an intro call
                </a>
              </div>
            </article>

            <article className="service">
              <div className="icon" aria-hidden="true">
                ★
              </div>
              <h3>Coaching for Leaders</h3>
              <p>
                A one-day intensive for managers and executives who want to move from telling to
                coaching. Hands-on, practical, and tailored to your team.
              </p>
              <div className="service-actions">
                <Link className="btn btn-primary" to="/offers/coaching-for-leaders/">
                  Learn more
                </Link>
                <a className="btn btn-secondary" href={mailto("Workshop inquiry")}>
                  Inquire about workshops
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
