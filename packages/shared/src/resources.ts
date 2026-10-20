import { z } from "zod";

/**
 * Downloadable resources. Every resource is gated: the PDFs live in a private R2 bucket and are
 * only reachable through a signed link that the API returns after the visitor enters their email.
 */
export type Resource = {
  slug: string;
  title: string;
  /** Object key in the R2 bucket `coaching-downloads`. */
  r2Key: string;
  /** File name the browser saves the download as. */
  fileName: string;
};

export const RESOURCES = {
  "four-goals": {
    slug: "four-goals",
    title: "The Four Goals Workbook",
    r2Key: "four-goals.pdf",
    fileName: "The-Four-Goals-Workbook.pdf",
  },
  unstuck: {
    slug: "unstuck",
    title: "The Unstuck Question Toolkit",
    r2Key: "unstuck.pdf",
    fileName: "Unstuck_Question_Toolkit_Worksheet.pdf",
  },
} as const satisfies Record<string, Resource>;

export type ResourceSlug = keyof typeof RESOURCES;

export const RESOURCE_SLUGS = Object.keys(RESOURCES) as [ResourceSlug, ...ResourceSlug[]];

export const resourceSlugSchema = z.enum(RESOURCE_SLUGS);

export function isResourceSlug(value: string): value is ResourceSlug {
  return Object.hasOwn(RESOURCES, value);
}
