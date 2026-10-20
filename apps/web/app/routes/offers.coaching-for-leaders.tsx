import type { Route } from "./+types/offers.coaching-for-leaders";
import { mailto } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Coaching for Leaders Workshop — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "A one-day intensive coaching workshop for corporate leaders and managers. Transition from traditional management to a high-impact coaching methodology.",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://chernyakov-coaching.com/offers/coaching-for-leaders/",
  },
];

export default function CoachingForLeaders() {
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="container">
          <span className="eyebrow">Workshop</span>
          <h1>Coaching for Leaders</h1>
          <p className="lead">
            Elevate your leadership — a one-day intensive for corporate leaders, executives, and
            managers ready to move from telling to coaching.
          </p>
          <p style={{ maxWidth: "720px", color: "var(--ink-soft)" }}>
            Modern organizational success depends on driving performance through people. This
            interactive, single-day workshop is engineered for leaders who want to transition from
            traditional management styles to a highly impactful coaching methodology. The program
            bypasses theoretical lectures and focuses heavily on mental preparation, active
            listening, and practical application.
          </p>
          <div className="hero-actions" style={{ marginTop: "24px" }}>
            <a className="btn btn-primary" href={mailto("Coaching for Leaders workshop inquiry")}>
              Inquire about a workshop
            </a>
            <a className="btn btn-secondary" href="#agenda">
              See the agenda
            </a>
          </div>
        </div>
      </section>

      {/* Coaching vs Mentoring */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Coaching vs Mentoring</span>
            <h2>Understanding the distinction</h2>
            <p>
              Many leaders confuse the two — and both have a place. The workshop draws a sharp line
              between mentoring (giving answers from experience) and coaching (asking questions to
              surface them).
            </p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Coaching</th>
                  <th>Mentoring</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Core approach</th>
                  <td>Inquiry-based — asks powerful questions to elicit internal solutions.</td>
                  <td>
                    Directive — provides advice, answers, and models based on personal experience.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Focus</th>
                  <td>Development of self-reliance, structure, and future action.</td>
                  <td>Knowledge transfer and navigating existing corporate pathways.</td>
                </tr>
                <tr>
                  <th scope="row">Ownership</th>
                  <td>The individual owns the outcome and defines their own action steps.</td>
                  <td>
                    The mentor shares a blueprint or suggestions for the individual to follow.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Corporate Benefits */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Corporate Benefits</span>
            <h2>Cultivating growth and engagement</h2>
            <p>
              Integrating a coaching culture into your organization correlates directly with
              sustained business performance and employee satisfaction. By training leaders to adopt
              a coaching mindset, companies unlock real advantages:
            </p>
          </div>

          <div className="experience-grid">
            <div className="experience-card">
              <h3>Evoking active listening</h3>
              <p>
                Shift the corporate communication standard from giving immediate advice to deeply
                understanding employee perspectives and the challenges underneath them.
              </p>
            </div>
            <div className="experience-card">
              <h3>Autonomy and accountability</h3>
              <p>
                When employees set their own self-directed actions, their engagement and
                psychological investment in the outcome scale exponentially.
              </p>
            </div>
            <div className="experience-card">
              <h3>Retention and happiness</h3>
              <p>
                Employees who feel heard, valued, and empowered experience higher workplace
                fulfillment — fostering a collaborative culture that drives long-term retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Workshop Agenda</span>
            <h2>Structured for adult learning</h2>
            <p>
              The curriculum is optimized for adult learning patterns through high-frequency
              feedback loops. Three connected modules, all hands-on.
            </p>
          </div>

          <div className="modules">
            <div className="module">
              <div className="module-num">01</div>
              <div>
                <h3>Foundations &amp; mental preparation</h3>
                <p>
                  Overcoming the default reflex to be an advice-giver. Preparing the mind to hold a
                  neutral, supportive space for team members and tolerate the silence required for
                  real reflection.
                </p>
              </div>
            </div>
            <div className="module">
              <div className="module-num">02</div>
              <div>
                <h3>Core coaching frameworks</h3>
                <p>
                  Introducing structural dialogue tools, powerful open-ended questioning habits, and
                  active listening metrics — the practical building blocks of a coaching
                  conversation.
                </p>
              </div>
            </div>
            <div className="module">
              <div className="module-num">03</div>
              <div>
                <h3>Practical application &amp; feedback loops</h3>
                <p>
                  Multiple live practice rounds where leaders coach peers on real scenarios,
                  receiving immediate, actionable feedback to lock in their newly developed skills
                  before they leave the room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Interested in running this with your team?</h2>
          <p>
            Tell me a bit about your team — size, level, what you're trying to shift — and I'll come
            back with a tailored proposal. Workshops can run as half-day, full-day, or multi-session
            formats.
          </p>
          <a className="btn btn-primary" href={mailto("Coaching for Leaders workshop inquiry")}>
            Inquire about a workshop
          </a>
        </div>
      </section>
    </>
  );
}
