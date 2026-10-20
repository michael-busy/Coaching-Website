import type { Route } from "./+types/offers.confidence-building";
import { BOOKING, SITE_URL } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Confidence Building — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "Confidence is a skill you can learn. Coaching focused on control, appearance, posture, attitude and leadership — with structured practice and reflection.",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: `${SITE_URL}/offers/confidence-building/`,
  },
];

export default function ConfidenceBuilding() {
  return (
    <>
      {/* Hero */}
      <section className="hero [border-top:none]">
        <div className="container">
          <span className="eyebrow">Service</span>
          <h1>Confidence is a skill — learn to build it</h1>
          <p className="lead">
            Trouble saying no, over-analysing, not speaking up in meetings or getting out of
            control. A mix of personal coaching with a focus on confidence building by improving
            your control, appearance, posture, attitude and leadership.
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
            <a className="btn btn-secondary" href="#elements">
              See the 5 elements
            </a>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Who it's for</span>
            <h2>If any of this sounds familiar, this is the work</h2>
            <p>
              Confidence isn't a personality trait some people are lucky enough to be born with.
              It's a set of behaviours that can be assessed, practised, and measurably improved —
              the same way any other skill can.
            </p>
          </div>

          <div className="experience-grid">
            <div className="experience-card">
              <h3>Trouble saying no</h3>
              <p>
                You take on more than you should because declining feels harder than absorbing the
                extra work.
              </p>
            </div>
            <div className="experience-card">
              <h3>Over-analysing</h3>
              <p>
                Decisions get replayed long after they're made, and the second-guessing costs you
                time and energy.
              </p>
            </div>
            <div className="experience-card">
              <h3>Not speaking up</h3>
              <p>
                You have the right point in the meeting but it stays unsaid — or gets said by
                someone else first.
              </p>
            </div>
            <div className="experience-card">
              <h3>Getting out of control</h3>
              <p>
                Pressure shows up in how you react, and you'd rather stay composed when it counts
                most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 elements */}
      <section id="elements">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The Process</span>
            <h2>The 5 key elements we focus on</h2>
            <p>
              A structured loop — assess where you are, define where you want to be, learn the
              principles, practise them in real situations, then reflect and refine.
            </p>
          </div>

          <div className="modules">
            <div className="module">
              <div className="module-num">01</div>
              <div>
                <h3>Current confidence level</h3>
                <p>
                  Assessment of your confidence level — an honest baseline of where you stand today,
                  across the situations that matter most to you.
                </p>
              </div>
            </div>
            <div className="module">
              <div className="module-num">02</div>
              <div>
                <h3>Target setting</h3>
                <p>
                  Set the confidence level you want to be at, so progress becomes something you can
                  actually see and measure rather than a vague feeling.
                </p>
              </div>
            </div>
            <div className="module">
              <div className="module-num">03</div>
              <div>
                <h3>Confidence principles</h3>
                <p>
                  Learn about the key confidence principles that build your confidence — the
                  underlying mechanics of control, appearance, posture, attitude and leadership.
                </p>
              </div>
            </div>
            <div className="module">
              <div className="module-num">04</div>
              <div>
                <h3>Practice</h3>
                <p>
                  Work on your confidence in real life via exercises — deliberately chosen, real
                  situations rather than theory in a room.
                </p>
              </div>
            </div>
            <div className="module">
              <div className="module-num">05</div>
              <div>
                <h3>Reflect &amp; improve</h3>
                <p>
                  Reflect in a session on what went well and what can improve, to set up the next
                  exercises. The loop repeats and compounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics */}
      <section>
        <div className="container">
          <div className="ethics-card">
            <span className="eyebrow">Ethical Standards</span>
            <h2>A confidential space to do this work</h2>
            <p>
              Confidence work means talking honestly about situations where things didn't go the way
              you wanted. That requires trust. I adhere to the International Coaching Federation
              (ICF) Code of Conduct and Ethics — guaranteeing total confidentiality, professional
              integrity, and clear boundaries throughout.
            </p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to build it?</h2>
          <p>
            Start with a free 20-minute intro call. Tell me where confidence is costing you right
            now, and we'll look at what the work could look like.
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
