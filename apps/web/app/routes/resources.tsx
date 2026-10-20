import { Link } from "react-router";
import type { Route } from "./+types/resources";
import { RESOURCE_CONTENT, resourcePath } from "~/lib/resources";
import { BOOKING, SITE_NAME, SITE_URL } from "~/lib/site";

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
    content: `${SITE_URL}/resources/`,
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
    tagName: "link",
    rel: "canonical",
    href: `${SITE_URL}/resources/`,
  },
];

export default function Resources() {
  return (
    <>
      {/* Hero */}
      <section className="hero [border-top:none]">
        <div className="container">
          <span className="eyebrow">Free Resources</span>
          <h1>Tools you can use today</h1>
          <p className="lead max-w-[680px]">
            Practical worksheets and tools from my coaching practice — all free. Take what's useful
            and leave the rest.
          </p>
        </div>
      </section>

      {/* Resource list */}
      <section>
        <div className="container">
          <div className="resource-list">
            {Object.values(RESOURCE_CONTENT).map((resource) => (
              <article key={resource.slug} className="resource-card">
                <div className="resource-icon" aria-hidden="true">
                  {resource.icon}
                </div>
                <div className="resource-body">
                  <h2>{resource.title}</h2>
                  <p>{resource.summary}</p>
                  <ul className="checklist">
                    {resource.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="resource-actions">
                    <Link className="btn btn-primary" to={resourcePath(resource.slug)}>
                      Get the {resource.kind}
                    </Link>
                    <span className="resource-meta">{resource.meta}</span>
                  </div>
                </div>
              </article>
            ))}
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
