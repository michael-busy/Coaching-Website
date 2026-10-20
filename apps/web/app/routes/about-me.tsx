import type { Route } from "./+types/about-me";
import { BOOKING, CONTACT_EMAIL, mailto } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "About — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "Michael Chernyakov — Product Lead at Solaris SE and coach for product managers. Banking customer experience and personal coaching for product professionals.",
  },
  {
    name: "author",
    content: "Michael Chernyakov",
  },
  {
    property: "og:type",
    content: "profile",
  },
  {
    property: "og:title",
    content: "About Michael Chernyakov — Chernyakov Coaching",
  },
  {
    property: "og:description",
    content:
      "Product Lead at Solaris SE and coach for product managers. Banking customer experience and personal coaching for product professionals.",
  },
  {
    property: "og:url",
    content: "https://chernyakov-coaching.com/about-me/",
  },
  {
    property: "og:image",
    content: "https://chernyakov-coaching.com/michael-profile.jpg",
  },
  {
    property: "og:site_name",
    content: "Chernyakov Coaching",
  },
  {
    property: "og:locale",
    content: "en_US",
  },
  {
    property: "profile:first_name",
    content: "Michael",
  },
  {
    property: "profile:last_name",
    content: "Chernyakov",
  },
  {
    name: "twitter:card",
    content: "summary_large_image",
  },
  {
    name: "twitter:title",
    content: "About Michael Chernyakov — Chernyakov Coaching",
  },
  {
    name: "twitter:description",
    content: "Product Lead at Solaris SE and coach for product managers.",
  },
  {
    name: "twitter:image",
    content: "https://chernyakov-coaching.com/michael-profile.jpg",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://chernyakov-coaching.com/about-me/",
  },
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Michael Chernyakov",
      url: "https://chernyakov-coaching.com/about-me/",
      image: "https://chernyakov-coaching.com/michael-profile.jpg",
      email: CONTACT_EMAIL,
      jobTitle: "Product Lead — B2C",
      worksFor: { "@type": "Organization", name: "Solaris SE" },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Technische Hochschule Köln — University of Applied Sciences",
        },
        { "@type": "CollegeOrUniversity", name: "CBS International Business School" },
      ],
    },
  },
];

export default function AboutMe() {
  return (
    <>
      {/* Hero with photo */}
      <section className="hero-about">
        <div className="container hero-about-grid">
          <div className="hero-about-text">
            <h1>Hi, I'm Michael Chernyakov.</h1>
            <p className="lead">
              I currently focus on banking customer experience and personal coaching following the
              ICF.
            </p>
            <p>
              By day, I'm Product Lead for B2C at Solaris SE in Berlin, building customer-facing
              banking products used by over a million people. Alongside that, I coach product
              managers and emerging business leaders on the work itself — managing stakeholders,
              shipping under pressure, growing teams, and building careers that hold up over time.
            </p>
            <div className="hero-actions mt-sm">
              <a
                className="btn btn-primary"
                href={BOOKING.intro}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book an intro call
              </a>
              <a className="btn btn-secondary" href={mailto()}>
                Email me
              </a>
            </div>
            <p className="email-line">
              <a href={mailto()}>{CONTACT_EMAIL}</a>
            </p>
          </div>
          <div className="hero-photo">
            <img
              src="/michael-profile.jpg"
              alt="Portrait of Michael Chernyakov"
              width="2000"
              height="1325"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Certification */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Certification</span>
            <h2>ICF-certified coach</h2>
          </div>
          <div className="cert-grid">
            <div className="cert-card">
              <p className="cert-figure">ICF ACC</p>
              <p className="cert-label">Associate Certified Coach since October 2026</p>
            </div>
            <div className="cert-card">
              <p className="cert-figure">25+</p>
              <p className="cert-label">Clients coached</p>
            </div>
          </div>
        </div>
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
          </div>
        </div>
      </section>

      {/* Current Role */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Current Role</span>
            <h2>Product Lead — B2C at Solaris SE</h2>
            <p>
              As Product Lead for B2C at Solaris SE, I'm responsible for our customer-facing banking
              solutions — from onboarding through to the apps themselves. The role spans commercial
              performance, continuous delivery, and coordination across many internal stakeholders,
              external partners, and customers.
            </p>
            <p>
              In September 2024, Solaris SE migrated 1.1 million credit cards from LBB. I led the
              build of the migration app, ran the migration itself, and have continued to expand the
              financial product offering inside the app since.
            </p>
          </div>
        </div>
      </section>

      {/* Work Experience timeline */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Career</span>
            <h2>Work experience</h2>
          </div>
          <ol className="timeline">
            <li className="timeline-item">
              <div className="timeline-date">10/2025 – Present</div>
              <div className="timeline-content">
                <h3>Product Lead — B2C</h3>
                <div className="org">Solaris SE · Berlin, Germany</div>
                <p>
                  Owning the B2C credit card portfolio and the customer-facing banking products
                  built on top of it.
                </p>
              </div>
            </li>
            <li className="timeline-item">
              <div className="timeline-date">2024 – 10/2025</div>
              <div className="timeline-content">
                <h3>Product Owner — Credit Card Apps</h3>
                <div className="org">Solaris SE · Berlin, Germany</div>
                <p>
                  Built and launched the ADAC iOS, Android, and Web banking apps, plus new customer
                  onboarding across online, physical branch, and call center.
                </p>
              </div>
            </li>
            <li className="timeline-item">
              <div className="timeline-date">2021 – 2023</div>
              <div className="timeline-content">
                <h3>Product Owner</h3>
                <div className="org">GLS — General Logistics Systems · Berlin, Germany</div>
                <p>Built products for logistics and last-mile delivery on Android and Web.</p>
              </div>
            </li>
            <li className="timeline-item">
              <div className="timeline-date">2019 – 2021</div>
              <div className="timeline-content">
                <h3>Product Owner</h3>
                <div className="org">Convidera GmbH · Cologne, Germany</div>
                <p>Shipped digital products in agency mode across multiple industries.</p>
              </div>
            </li>
            <li className="timeline-item">
              <div className="timeline-date">2017 – 2019</div>
              <div className="timeline-content">
                <h3>Junior Consultant &amp; Consultant Trainee</h3>
                <div className="org">Convidera GmbH · Cologne, Germany</div>
                <p>
                  Consulting projects focused on executive training, digital marketing, and
                  corporate branding strategy.
                </p>
              </div>
            </li>
            <li className="timeline-item">
              <div className="timeline-date">2016 – 2017</div>
              <div className="timeline-content">
                <h3>Market Analyst</h3>
                <div className="org">Procane GmbH · Cologne, Germany</div>
                <p>Conducted market research and analytical projects.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Education</span>
            <h2>Studied</h2>
          </div>
          <ol className="timeline">
            <li className="timeline-item">
              <div className="timeline-date">2021 – 2023</div>
              <div className="timeline-content">
                <h3>M.Sc. in Web Science</h3>
                <div className="org">
                  Technische Hochschule Köln — University of Applied Sciences
                </div>
              </div>
            </li>
            <li className="timeline-item">
              <div className="timeline-date">2014 – 2017</div>
              <div className="timeline-content">
                <h3>B.A. in International Business</h3>
                <div className="org">CBS International Business School</div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Curious about coaching?</h2>
          <p>
            If you're a product manager or business leader navigating a stretch — new role, big
            launch, team rebuild, career pivot — I'd love to hear about it. The intro call is free.
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
