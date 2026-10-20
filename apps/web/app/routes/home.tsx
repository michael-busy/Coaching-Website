import { Link } from "react-router";
import { AutoplayVideo } from "~/components/sections/AutoplayVideo";
import type { Route } from "./+types/home";
import { BOOKING, SITE_NAME, SITE_URL } from "~/lib/site";

export const links: Route.LinksFunction = () => [
  { rel: "preload", as: "image", href: "/michael-speaking.jpg", fetchPriority: "high" },
];

export const meta: Route.MetaFunction = () => [
  {
    title: "Chernyakov Coaching — Personal Development & Leadership Coaching",
  },
  {
    name: "description",
    content:
      "Personal and performance coaching for business owners, entrepreneurs, and leaders. One-on-one coaching, confidence building, and workshops rooted in the ICF framework.",
  },
  {
    name: "author",
    content: "Michael Chernyakov",
  },
  {
    property: "og:type",
    content: "website",
  },
  {
    property: "og:title",
    content: "Chernyakov Coaching — Personal Development & Leadership Coaching",
  },
  {
    property: "og:description",
    content:
      "Personal and performance coaching for business owners and entrepreneurs, plus confidence-building sessions.",
  },
  {
    property: "og:url",
    content: `${SITE_URL}/`,
  },
  {
    property: "og:image",
    content: `${SITE_URL}/michael-speaking.jpg`,
  },
  {
    property: "og:site_name",
    content: SITE_NAME,
  },
  {
    property: "og:locale",
    content: "en_US",
  },
  {
    name: "twitter:card",
    content: "summary_large_image",
  },
  {
    name: "twitter:title",
    content: SITE_NAME,
  },
  {
    name: "twitter:description",
    content: "Personal and performance coaching for business owners and entrepreneurs.",
  },
  {
    name: "twitter:image",
    content: `${SITE_URL}/michael-speaking.jpg`,
  },
  {
    tagName: "link",
    rel: "canonical",
    href: `${SITE_URL}/`,
  },
];

export default function Home() {
  return (
    <>
      {/* Full-screen hero video (motion illustration, no controls) */}
      <section className="hero-fullscreen">
        <AutoplayVideo src="/background-video-2.mp4" />

        <div className="hero-overlay">
          <h1 className="hero-title">Unlock Your Potential</h1>
        </div>

        <a className="hero-scroll" href="#personal-coaching">
          <span className="hero-scroll-text">Discover more</span>
          <svg
            className="hero-scroll-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </a>
      </section>

      {/* Coaching philosophy */}
      <section className="philosophy">
        <div className="container">
          <div className="philosophy-inner">
            <span className="eyebrow">Coaching Philosophy</span>
            <p className="philosophy-lead">
              I coach motivated individuals to take themselves to the next level and outperform. My
              coaching is built on taking clear action — to execute and deliver.
            </p>
            <p className="philosophy-body">
              We all have ideas in our minds, but the ones that move forward belong to those who
              take action. There are challenges and barriers in the way. Together, we work to
              understand what is stopping you and set up an action plan.
            </p>
            <Link className="philosophy-link" to="/about-me/">
              More about me →
            </Link>
          </div>
        </div>
      </section>

      {/* Personal Coaching */}
      <section id="personal-coaching" className="offer-section">
        <div className="container">
          <div className="offer-grid">
            <div className="offer-content">
              <span className="eyebrow">Personal Coaching</span>
              <h2>Get your thoughts and actions structured</h2>
              <p className="lead">
                Every day we are trying to achieve more, leading to more thoughts and distractions
                and the best path gets blurred. Get your thoughts in order for a clear action
                forward.
              </p>

              <h3 className="process-title">How the process works</h3>
              <ol className="process-steps">
                <li>
                  <span className="step-num">1</span>
                  <div>
                    <h4>Clarify your goals</h4>
                    <p>
                      Articulate exactly what you want to achieve, when you want to get there and
                      why it matters to you.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <div>
                    <h4>Assess current reality</h4>
                    <p>Honestly evaluate where you stand today and what's getting in the way.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <div>
                    <h4>Explore your options</h4>
                    <p>Discover strategies and pathways to move you forward with intent.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">4</span>
                  <div>
                    <h4>Commit to action</h4>
                    <p>Establish concrete next steps and the accountability to see them through.</p>
                  </div>
                </li>
              </ol>

              <Link className="btn btn-primary" to="/offers/personal-coaching/">
                Learn more about personal coaching
              </Link>
            </div>
            <div className="offer-image">
              <img src="/michael-speaking.jpg" alt="Michael Chernyakov coaching" />
            </div>
          </div>
        </div>
      </section>

      {/* Confidence Building */}
      <section className="offer-section offer-section--alt">
        <div className="container">
          <div className="offer-grid">
            <div className="offer-content">
              <span className="eyebrow">Confidence Building</span>
              <h2>Confidence is a skill — learn to build it</h2>
              <p className="lead">
                Trouble saying no, over-analysing, not speaking up in meetings or getting out of
                control. A mix of personal coaching with a focus on confidence building by improving
                your control, appearance, posture, attitude and leadership.
              </p>

              <h3 className="process-title">The 5 key elements we focus on</h3>
              <ol className="process-steps">
                <li>
                  <span className="step-num">1</span>
                  <div>
                    <h4>Current confidence level</h4>
                    <p>Assessment of your confidence level.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <div>
                    <h4>Target setting</h4>
                    <p>Set the confidence level you want to be at.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <div>
                    <h4>Confidence principles</h4>
                    <p>Learn about the key confidence principles that build your confidence.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">4</span>
                  <div>
                    <h4>Practice</h4>
                    <p>Work on your confidence in real life via exercises.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">5</span>
                  <div>
                    <h4>Reflect &amp; improve</h4>
                    <p>
                      Reflect in a session on what went well and what can improve, to set up the
                      next exercises.
                    </p>
                  </div>
                </li>
              </ol>

              <Link className="btn btn-primary" to="/offers/confidence-building/">
                Learn more about building confidence
              </Link>
            </div>
            <div className="offer-image">
              <img src="/michael-profile.jpg" alt="Portrait of Michael Chernyakov" />
            </div>
          </div>
        </div>
      </section>

      {/* Discovery session CTA */}
      <section id="discovery" className="discovery-cta">
        <div className="container">
          <span className="eyebrow">Start now</span>
          <h2>Book a free 20-minute discovery session</h2>
          <p>
            A short, no-pressure conversation to hear what you're working on and see whether we're
            the right fit. No pitch — just a real conversation.
          </p>
          <a
            className="btn btn-primary btn-large"
            href={BOOKING.discovery}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book your discovery session
          </a>
        </div>
      </section>
    </>
  );
}
