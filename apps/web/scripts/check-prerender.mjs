// Verifies the static build: every route was prerendered with real content and SEO tags,
// and gated downloads did not leak into the public output. Run after `pnpm build`.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const client = fileURLToPath(new URL("../build/client/", import.meta.url));
const failures = [];
const fail = (message) => failures.push(message);

if (!existsSync(client)) {
  console.error("build/client is missing — run `pnpm build` first.");
  process.exit(1);
}

// Written by the buildEnd hook in react-router.config.ts.
const PRERENDER_PATHS = JSON.parse(
  readFileSync(fileURLToPath(new URL("../build/prerender-paths.json", import.meta.url)), "utf8"),
);

for (const path of PRERENDER_PATHS) {
  const file = join(client, path, "index.html");
  if (!existsSync(file)) {
    fail(`${path}: missing ${file}`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1] ?? "";
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${path}: no <title>`);
  if (main.replace(/<[^>]+>/g, "").trim().length < 40)
    fail(`${path}: <main> has no prerendered content`);
  if (path === "/404") {
    if (!/<meta name="robots" content="noindex"/.test(html)) fail(`${path}: should be noindex`);
    continue;
  }
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${path}: no meta description`);
  const canonical = `https://chernyakov-coaching.com${path}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}"`))
    fail(`${path}: canonical should be ${canonical}`);
  if (!html.includes("cloud.umami.is/script.js")) fail(`${path}: Umami script missing`);
}

for (const file of [
  "404.html",
  "_redirects",
  "_headers",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
]) {
  if (!existsSync(join(client, file))) fail(`missing build/client/${file}`);
}

// Every resource is email-gated: no PDF may be served as a public static file.
const pdfs = readdirSync(client, { recursive: true }).filter((f) => String(f).endsWith(".pdf"));
for (const pdf of pdfs) fail(`PDF in public output (downloads must go through R2): ${pdf}`);

const resourcePages = PRERENDER_PATHS.filter((p) => /^\/resources\/[^/]+\/$/.test(p));
if (resourcePages.length === 0) fail("no /resources/<slug>/ pages were prerendered");
const resourcesIndex = readFileSync(join(client, "resources/index.html"), "utf8");
for (const path of resourcePages) {
  const html = readFileSync(join(client, path, "index.html"), "utf8");
  if (!html.includes('class="lm-form"')) fail(`${path}: signup form missing`);
  if (html.includes('name="robots"')) fail(`${path}: resource pages should be indexable`);
  if (!resourcesIndex.includes(`href="${path}"`)) fail(`/resources/: no link to ${path}`);
}
if (existsSync(join(client, "guide"))) fail("/guide/ should be a redirect, not a page");

const about = readFileSync(join(client, "about-me/index.html"), "utf8");
if (!about.includes('"@type":"Person"')) fail("/about-me/: JSON-LD Person missing");
if (failures.length) {
  console.error(`Prerender check failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `Prerender check passed: ${PRERENDER_PATHS.length} pages (${resourcePages.length} resource pages), no public PDFs.`,
);
