// Uploads the PDFs to R2 bucket `coaching-downloads`: local by default, `--remote` for Cloudflare.
// They are read from the old static site's last commit, so they never sit in the public tree.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SOURCE_COMMIT = "795db31";
// r2Key → path at SOURCE_COMMIT. Keys must match packages/shared/src/resources.ts.
const FILES = {
  "four-goals.pdf": "downloads/The-Four-Goals-Workbook.pdf",
  "unstuck.pdf": "downloads/Unstuck_Question_Toolkit_Worksheet.pdf",
};

const target = process.argv.includes("--remote") ? "--remote" : "--local";
const dir = mkdtempSync(join(tmpdir(), "coaching-r2-"));
try {
  for (const [key, path] of Object.entries(FILES)) {
    const file = join(dir, key);
    writeFileSync(file, execFileSync("git", ["show", `${SOURCE_COMMIT}:${path}`]));
    execFileSync(
      "pnpm",
      [
        "--filter",
        "@coaching/api",
        "exec",
        "wrangler",
        "r2",
        "object",
        "put",
        `coaching-downloads/${key}`,
        "--file",
        file,
        "--content-type",
        "application/pdf",
        target,
      ],
      { stdio: "inherit" },
    );
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
