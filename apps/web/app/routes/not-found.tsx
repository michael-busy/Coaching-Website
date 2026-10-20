import { Link } from "react-router";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => [
  { title: "Page not found — Chernyakov Coaching" },
  { name: "robots", content: "noindex" },
];

export default function NotFound() {
  return (
    <section className="hero" style={{ borderTop: "none" }}>
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p className="lead">The page you are looking for does not exist or has moved.</p>
        <Link className="btn btn-primary" to="/">
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
