import { NotFoundSection } from "~/components/sections/NotFoundSection";
import { SignupForm } from "~/features/signup/SignupForm";
import { getResourceContent, resourcePath } from "~/lib/resources";
import { BOOKING, SITE_NAME, SITE_URL } from "~/lib/site";
import type { Route } from "./+types/resource";

export const meta: Route.MetaFunction = ({ params }) => {
  const resource = getResourceContent(params.slug);
  if (!resource) {
    return [{ title: `Page not found — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
  }
  const url = `${SITE_URL}${resourcePath(resource.slug)}`;
  return [
    { title: `Free Download: ${resource.title} — ${SITE_NAME}` },
    { name: "description", content: resource.seoDescription },
    { property: "og:type", content: "website" },
    { property: "og:title", content: `Free Download: ${resource.title}` },
    { property: "og:description", content: resource.ogDescription },
    { property: "og:url", content: url },
    { property: "og:image", content: `${SITE_URL}/michael-speaking.jpg` },
    { property: "og:site_name", content: SITE_NAME },
    { tagName: "link", rel: "canonical", href: url },
  ];
};

export default function ResourcePage({ params }: Route.ComponentProps) {
  const resource = getResourceContent(params.slug);
  if (!resource) return <NotFoundSection />;

  return (
    <>
      {/* Hero + form */}
      <section className="hero [border-top:none]">
        <div className="container lead-magnet-grid">
          <div className="lead-magnet-content">
            <span className="eyebrow">Free download</span>
            <h1>{resource.title}</h1>
            <p className="lead">{resource.summary}</p>

            <h2 className="process-title">What's inside</h2>
            <ul className="checklist">
              {(resource.inside ?? resource.highlights).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="lead-magnet-note">
              Free, and useful whether or not we ever work together.
            </p>
          </div>

          <aside className="lead-magnet-form-wrap">
            <div className="lead-magnet-form">
              <h2>Get the {resource.kind}</h2>
              <p>Enter your email and the download starts straight away.</p>

              {/* key: reset the form state when navigating between resources */}
              <SignupForm key={resource.slug} resource={resource} />
            </div>
          </aside>
        </div>
      </section>

      {resource.whoFor && (
        <section>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Who it's for</span>
              <h2>{resource.whoFor.title}</h2>
              <p>{resource.whoFor.text}</p>
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="cta-band">
        <div className="container">
          <h2>Want to go further?</h2>
          <p>
            The {resource.kind} is a starting point. If you'd rather work through it with someone,
            the intro call is free and there's no pitch attached.
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
