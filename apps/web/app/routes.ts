import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about-me", "routes/about-me.tsx"),
  route("offers", "routes/offers.tsx"),
  route("offers/personal-coaching", "routes/offers.personal-coaching.tsx"),
  route("offers/confidence-building", "routes/offers.confidence-building.tsx"),
  route("offers/coaching-for-leaders", "routes/offers.coaching-for-leaders.tsx"),
  route("resources", "routes/resources.tsx"),
  route("resources/:slug", "routes/resource.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
