// Cloudflare's "404-page" handling serves the nearest 404.html; the prerendered catch-all
// route lands in build/client/404/index.html, so copy it to the root.
import { copyFile } from "node:fs/promises";

const client = new URL("../build/client/", import.meta.url);
await copyFile(new URL("404/index.html", client), new URL("404.html", client));
console.log("postbuild: wrote build/client/404.html");
