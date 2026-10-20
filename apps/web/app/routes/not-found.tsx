import { NotFoundSection } from "~/components/sections/NotFoundSection";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => [
  { title: "Page not found — Chernyakov Coaching" },
  { name: "robots", content: "noindex" },
];

export default function NotFound() {
  return <NotFoundSection />;
}
