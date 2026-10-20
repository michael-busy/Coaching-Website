import { zValidator } from "@hono/zod-validator";
import { RESOURCES, resourceSlugSchema } from "@coaching/shared";
import { Hono } from "hono";
import { z } from "zod";
import { requireEnv, type AppEnv } from "../env";
import { verifyDownloadToken } from "../services/tokens";

export const downloads = new Hono<AppEnv>().get(
  "/:slug",
  zValidator("param", z.object({ slug: resourceSlugSchema }), (result, c) => {
    if (!result.success) return c.json({ error: "not_found" }, 404);
  }),
  // A missing token is handled like an invalid one (redirect), not as a 400.
  zValidator("query", z.object({ t: z.string().default("") })),
  async (c) => {
    const { slug } = c.req.valid("param");
    const { t } = c.req.valid("query");
    const resource = RESOURCES[slug];

    const status = await verifyDownloadToken(requireEnv(c.env, "DOWNLOAD_TOKEN_SECRET"), t, slug);
    if (status !== "valid") {
      // The resource page explains the problem and lets them request a new link.
      return c.redirect(`/resources/${slug}/?link=${status}`, 302);
    }

    const object = await c.env.DOWNLOADS.get(resource.r2Key);
    if (!object) {
      console.error("Download missing from R2", { key: resource.r2Key });
      return c.json({ error: "not_found" }, 404);
    }

    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType ?? "application/pdf",
        "Content-Disposition": `attachment; filename="${resource.fileName}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
        ETag: object.httpEtag,
      },
    });
  },
);
