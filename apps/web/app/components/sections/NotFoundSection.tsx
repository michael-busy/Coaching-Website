import { Link } from "react-router";

export function NotFoundSection() {
  return (
    <section className="hero [border-top:none]">
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
