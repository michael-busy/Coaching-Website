import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "./app.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { SiteFooter } from "~/components/layout/SiteFooter";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { UMAMI_WEBSITE_ID } from "~/lib/site";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#2f4a3a" />
        <Meta />
        <Links />
        {/* Umami analytics (cookieless, EU-hosted) */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id={UMAMI_WEBSITE_ID} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <section className="hero [border-top:none]">
      <div className="container">
        <h1>{notFound ? "Page not found" : "Something went wrong"}</h1>
        <p className="lead">
          {notFound
            ? "The page you are looking for does not exist."
            : "Please reload the page or try again later."}
        </p>
      </div>
    </section>
  );
}
