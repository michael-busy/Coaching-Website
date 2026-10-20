import { Link } from "react-router";
import type { Route } from "./+types/resources";
import { BOOKING } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Free Resources — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "Free worksheets and tools from Michael Chernyakov — practical coaching resources you can download and use straight away.",
  },
  {
    property: "og:type",
    content: "website",
  },
  {
    property: "og:title",
    content: "Free Resources — Chernyakov Coaching",
  },
  {
    property: "og:description",
    content: "Free worksheets and tools you can download and use straight away.",
  },
  {
    property: "og:url",
    content: "https://chernyakov-coaching.com/resources/",
  },
  {
    property: "og:image",
    content: "https://chernyakov-coaching.com/michael-speaking.jpg",
  },
  {
    property: "og:site_name",
    content: "Chernyakov Coaching",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://chernyakov-coaching.com/resources/",
  },
];

export default function Resources() {
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="container">
          <span className="eyebrow">Free Resources</span>
          <h1>Tools you can use today</h1>
          <p className="lead" style={{ maxWidth: "680px" }}>
            Practical worksheets and tools from my coaching practice — all free. Take what's useful
            and leave the rest.
          </p>
        </div>
      </section>

      {/* Resource list */}
      <section>
        <div className="container">
          <div className="resource-list">
            <article className="resource-card">
              <div className="resource-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="26"
                  height="26"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1" />
                </svg>
              </div>
              <div className="resource-body">
                <h2>The Four Goals Workbook</h2>
                <p>
                  Most goals fail because everything rests on the one outcome you don't control.
                  This workbook splits a single goal into four levels — the dream, the end goal,
                  your standard and your daily process — so you know exactly which parts are yours
                  to hold.
                </p>
                <ul className="checklist">
                  <li>The four-level goals pyramid, with one fill-in sentence for each level</li>
                  <li>
                    Worked examples for every level, plus a simple test to check you've got it right
                  </li>
                  <li>A one-page "Your Turn" exercise: one goal, four sentences, ten minutes</li>
                </ul>
                <div className="resource-actions">
                  <a
                    className="btn btn-primary"
                    href="/downloads/The-Four-Goals-Workbook.pdf"
                    download
                  >
                    Download the workbook
                  </a>
                  <span className="resource-meta">PDF · 7 pages · free · no signup</span>
                </div>
              </div>
            </article>

            <article className="resource-card">
              <div className="resource-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="26"
                  height="26"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M9 15h6M9 11h6" />
                </svg>
              </div>
              <div className="resource-body">
                <h2>The Unstuck Question Toolkit</h2>
                <p>
                  When you're stuck, the problem usually isn't a lack of effort — it's that the
                  thinking hasn't been untangled yet. This worksheet gives you the questions a coach
                  would ask, so you can work through it on your own.
                </p>
                <ul className="checklist">
                  <li>A structured set of coaching questions to move you from stuck to clear</li>
                  <li>Space to write your answers as you work through it</li>
                  <li>A repeatable process you can return to whenever you feel blocked</li>
                </ul>
                <div className="resource-actions">
                  <Link className="btn btn-primary" to="/guide/">
                    Get the worksheet
                  </Link>
                  <span className="resource-meta">PDF · free · sent to your inbox</span>
                </div>
              </div>
            </article>
          </div>

          <p className="resource-more">
            More resources are on the way — worksheets on confidence and leadership conversations
            are in progress.
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Want to go further?</h2>
          <p>
            The worksheets work on their own, but they work faster with someone asking the follow-up
            questions. My intro call is free and there's no pitch attached.
          </p>
          <a
            className="btn btn-primary"
            href={BOOKING.call}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a free intro call
          </a>
        </div>
      </section>
    </>
  );
}
