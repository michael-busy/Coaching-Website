import { GATED_RESOURCE_SLUGS, RESOURCES, type GatedResourceSlug } from "@coaching/shared";
import { Hono } from "hono";
import { requireEnv, type AppEnv } from "../env";
import { verifyDownloadToken } from "../services/tokens";

function isGatedSlug(slug: string): slug is GatedResourceSlug {
  return (GATED_RESOURCE_SLUGS as readonly string[]).includes(slug);
}

export const downloads = new Hono<AppEnv>().get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!isGatedSlug(slug)) return c.json({ error: "not_found" }, 404);
  const resource = RESOURCES[slug];

  const status = await verifyDownloadToken(
    requireEnv(c.env, "DOWNLOAD_TOKEN_SECRET"),
    c.req.query("t") ?? "",
    slug,
  );
  if (status !== "valid") {
    // Send people back to the signup page, which explains the link has expired.
    return c.redirect(`/guide/?link=${status}`, 302);
  }

  const object = await c.env.DOWNLOADS.get(resource.r2Key);
  if (!object) {
    console.error("Gated download missing from R2", { key: resource.r2Key });
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
});
