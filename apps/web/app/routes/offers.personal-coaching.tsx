import { AutoplayVideo } from "~/components/sections/AutoplayVideo";
import type { Route } from "./+types/offers.personal-coaching";
import { BOOKING } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Personal Coaching — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "Personal coaching with Michael Chernyakov. Get your thoughts and mind in order — built on the GROW framework, SMART goal-setting, and ICF ethical standards.",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://chernyakov-coaching.com/offers/personal-coaching/",
  },
];

export default function PersonalCoaching() {
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="container hero-split hero-split--7030">
          <div>
            <h1>Personal Coaching</h1>
            <p className="lead">
              Every day we are trying to achieve more, leading to more thoughts and distractions —
              and the best path gets blurred. Get your thoughts in order for a clear action forward.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href={BOOKING.intro}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a free intro call
              </a>
              <a className="btn btn-secondary" href="#framework">
                See how it works
              </a>
            </div>
          </div>
          <div className="hero-media" aria-hidden="true">
            <AutoplayVideo src="/circle-vertical.mp4" />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section>
        <div className="container">
          <div className="section-head section-head--wide">
            <span className="eyebrow">My Philosophy</span>
            <h2>Unlocking your internal potential</h2>
            <p>
              Every individual has an innate capacity for change, growth, and extraordinary success.
              Often the barrier isn't a lack of talent or ambition — it's the absence of a dedicated
              structure and an objective thinking partner to untangle complex thoughts.
            </p>
            <p>
              Real transformation happens when you have the space to safely explore ideas, test
              assumptions, and bring order to chaos. My role as your coach is not to give you the
              answers, but to act as that critical thinking partner — helping you build the
              psychological and operational structures required to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section id="framework">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The Framework</span>
            <h2>Structured for execution</h2>
            <p>
              To ensure every conversation translates into measurable growth, our engagements follow
              a rigorous methodology grounded in performance science.
            </p>
          </div>

          <div className="experience-grid">
            <div className="experience-card">
              <h3>One-hour dedicated sessions</h3>
              <p>
                Focused, high-impact dialogues tailored to your most immediate and strategic
                priorities. Each session has a clear opening, working space, and commitment phase.
              </p>
            </div>
            <div className="experience-card">
              <h3>SMART goal-setting</h3>
              <p>
                We define objectives that are Specific, Measurable, Achievable, Relevant, and
                Time-bound — so your aspirations are grounded in reality and progress is trackable.
              </p>
            </div>
            <div className="experience-card">
              <h3>The GROW model</h3>
              <p>
                Each session uses Sir John Whitmore's GROW framework to move you from intent to
                action — a benchmark methodology used in professional coaching worldwide.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: "600",
                fontSize: "1.4rem",
                marginBottom: "8px",
              }}
            >
              Inside the GROW model
            </h3>
            <p style={{ color: "var(--ink-soft)", marginBottom: "16px" }}>
              Every session moves through four stages — building from clarity to action.
            </p>
            <ol className="grow-list">
              <li>
                <div className="grow-label">G — Goal</div>
                <div className="grow-desc">
                  Articulate exactly what you want to achieve, when you want to get there and why it
                  matters to you.
                </div>
              </li>
              <li>
                <div className="grow-label">R — Reality</div>
                <div className="grow-desc">
                  Assessing the current situation honestly — and identifying the internal and
                  external obstacles in the way.
                </div>
              </li>
              <li>
                <div className="grow-label">O — Options</div>
                <div className="grow-desc">
                  Exploring alternative strategies, solutions, and creative pathways forward —
                  without filtering too early.
                </div>
              </li>
              <li>
                <div className="grow-label">W — Will / Way forward</div>
                <div className="grow-desc">
                  Solidifying explicit commitments, concrete action steps, and the deadlines that
                  hold them.
                </div>
              </li>
            </ol>
          </div>

          <p style={{ marginTop: "32px", color: "var(--ink-soft)", fontSize: ".98rem" }}>
            While we maintain a strong macro-structure, each session is dynamic — bring the real
            challenges and goals you're facing right now, and we'll work through them with the
            framework.
          </p>
        </div>
      </section>

      {/* Ethics */}
      <section>
        <div className="container">
          <div className="ethics-card">
            <span className="eyebrow">Ethical Standards</span>
            <h2>Uncompromising confidentiality and integrity</h2>
            <p>
              Trust is the foundation of any successful coaching dynamic. I adhere to the
              International Coaching Federation (ICF) Code of Conduct and Ethics — guaranteeing
              total confidentiality, professional integrity, and a relationship built on mutual
              respect and clarity of boundaries.
            </p>
            <p>
              You step into each session knowing your professional assets and personal insights are
              protected by the industry's highest global standards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to start?</h2>
          <p>
            The intro call is free and pressure-free. Bring a challenge, a question, or just
            curiosity — and we'll see if working together makes sense.
          </p>
          <a
            className="btn btn-primary"
            href={BOOKING.intro}
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
