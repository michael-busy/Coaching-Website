/**
 * Downloadable resources offered on the site.
 *
 * Free resources are plain static files under `/downloads/`. Gated resources live in a
 * private R2 bucket and are only reachable through a signed link sent after email signup.
 */
export type Resource =
  | { slug: string; title: string; gated: false; publicPath: string }
  | { slug: string; title: string; gated: true; r2Key: string; fileName: string };

export const RESOURCES = {
  "four-goals": {
    slug: "four-goals",
    title: "The Four Goals Workbook",
    gated: false,
    publicPath: "/downloads/The-Four-Goals-Workbook.pdf",
  },
  unstuck: {
    slug: "unstuck",
    title: "The Unstuck Question Toolkit",
    gated: true,
    r2Key: "unstuck.pdf",
    fileName: "Unstuck_Question_Toolkit_Worksheet.pdf",
  },
} as const satisfies Record<string, Resource>;

export type ResourceSlug = keyof typeof RESOURCES;

export const GATED_RESOURCE_SLUGS = ["unstuck"] as const satisfies readonly ResourceSlug[];
export type GatedResourceSlug = (typeof GATED_RESOURCE_SLUGS)[number];
