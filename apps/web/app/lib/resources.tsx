import { RESOURCES, isResourceSlug, type ResourceSlug } from "@coaching/shared";
import type { ReactNode } from "react";

/** Page copy for each downloadable resource (file details live in @coaching/shared). */
export type ResourceContent = {
  slug: ResourceSlug;
  title: string;
  /** "workbook" / "worksheet": used in button and heading copy. */
  kind: string;
  /** Card text on /resources/ and the lead paragraph on the resource page. */
  summary: string;
  /** Bullets on the /resources/ card. */
  highlights: string[];
  /** "What's inside" bullets on the resource page (defaults to `highlights`). */
  inside?: string[];
  /** e.g. "PDF · 7 pages · free". */
  meta: string;
  seoDescription: string;
  ogDescription: string;
  /** Optional "Who it's for" section on the resource page. */
  whoFor?: { title: string; text: string };
  icon: ReactNode;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "26",
  height: "26",
} as const;

export const RESOURCE_CONTENT: Record<ResourceSlug, ResourceContent> = {
  "four-goals": {
    slug: "four-goals",
    title: RESOURCES["four-goals"].title,
    kind: "workbook",
    summary:
      "Most goals fail because everything rests on the one outcome you don't control. This workbook splits a single goal into four levels — the dream, the end goal, your standard and your daily process — so you know exactly which parts are yours to hold.",
    highlights: [
      "The four-level goals pyramid, with one fill-in sentence for each level",
      "Worked examples for every level, plus a simple test to check you've got it right",
      'A one-page "Your Turn" exercise: one goal, four sentences, ten minutes',
    ],
    meta: "PDF · 7 pages · free",
    seoDescription:
      "A free workbook that splits one goal into four levels — the dream, the end goal, your standard and your daily process. Enter your email to download it.",
    ogDescription:
      "A free workbook that splits one goal into four levels, so you know which parts are yours to hold.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  unstuck: {
    slug: "unstuck",
    title: RESOURCES.unstuck.title,
    kind: "worksheet",
    summary:
      "When you're stuck, the problem usually isn't a lack of effort — it's that the thinking hasn't been untangled yet. This worksheet gives you the questions a coach would ask, so you can work through it on your own.",
    highlights: [
      "A structured set of coaching questions to move you from stuck to clear",
      "Space to write your answers as you work through it",
      "A repeatable process you can return to whenever you feel blocked",
    ],
    inside: [
      "A structured set of coaching questions to move you from stuck to clear",
      "Space to write your answers as you work through it",
      "A repeatable process you can return to whenever you feel blocked",
      "Practical throughout — no theory, no filler",
    ],
    meta: "PDF · free",
    seoDescription:
      "A free worksheet of coaching questions to help you get unstuck, order your thinking, and decide what to do next. Enter your email to download it.",
    ogDescription:
      "A free worksheet of coaching questions to help you get unstuck and decide what to do next.",
    whoFor: {
      title: "Anyone with more going on than headspace",
      text: "You don't need to be running a company to get value from this. If you've got competing priorities, a decision you keep circling, or a goal that's been sitting still for months, the questions in this worksheet are designed to move you.",
    },
    icon: (
      <svg {...iconProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15h6M9 11h6" />
      </svg>
    ),
  },
};

export function getResourceContent(slug: string | undefined): ResourceContent | undefined {
  return slug && isResourceSlug(slug) ? RESOURCE_CONTENT[slug] : undefined;
}

export function resourcePath(slug: ResourceSlug): string {
  return `/resources/${slug}/`;
}
