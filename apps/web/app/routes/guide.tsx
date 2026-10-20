import { LinkStatusNotice } from "~/features/signup/LinkStatusNotice";
import { SignupForm } from "~/features/signup/SignupForm";
import type { Route } from "./+types/guide";
import { BOOKING } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Free Download: The Unstuck Question Toolkit — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "A free worksheet of coaching questions to help you get unstuck, order your thinking, and decide what to do next. Enter your email and we'll send it over.",
  },
  {
    name: "robots",
    content: "noindex, nofollow",
  },
  {
    property: "og:type",
    content: "website",
  },
  {
    property: "og:title",
    content: "Free Download: The Unstuck Question Toolkit",
  },
  {
    property: "og:description",
    content:
      "A free worksheet of coaching questions to help you get unstuck and decide what to do next.",
  },
  {
    property: "og:url",
    content: "https://chernyakov-coaching.com/guide/",
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
    href: "https://chernyakov-coaching.com/guide/",
  },
];

export default function Guide() {
  return (
    <>
      {/* Hero + form */}
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="container lead-magnet-grid">
          <div className="lead-magnet-content">
            <span className="eyebrow">Free download</span>
            <h1>The Unstuck Question Toolkit</h1>
            <p className="lead">
              When you're stuck, the problem usually isn't a lack of effort — it's that the thinking
              hasn't been untangled yet. This worksheet gives you the questions a coach would ask,
              so you can work through it on your own.
            </p>

            <h2 className="process-title">What's inside</h2>
            <ul className="checklist">
              <li>A structured set of coaching questions to move you from stuck to clear</li>
              <li>Space to write your answers as you work through it</li>
              <li>A repeatable process you can return to whenever you feel blocked</li>
              <li>Practical throughout — no theory, no filler</li>
            </ul>

            <p className="lead-magnet-note">
              Free, and useful whether or not we ever work together.
            </p>
          </div>

          <aside className="lead-magnet-form-wrap">
            <div className="lead-magnet-form">
              <h2>Get the worksheet</h2>
              <p>Enter your email and I'll send the download link straight to your inbox.</p>

              <LinkStatusNotice />
              <SignupForm resource="unstuck" emailSubject="Unstuck Question Toolkit" />
            </div>
          </aside>
        </div>
      </section>

      {/* Who it's for */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Who it's for</span>
            <h2>Anyone with more going on than headspace</h2>
            <p>
              You don't need to be running a company to get value from this. If you've got competing
              priorities, a decision you keep circling, or a goal that's been sitting still for
              months, the questions in this worksheet are designed to move you.
            </p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Want to go further?</h2>
          <p>
            The worksheet is a starting point. If you'd rather work through it with someone, the
            intro call is free and there's no pitch attached.
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
