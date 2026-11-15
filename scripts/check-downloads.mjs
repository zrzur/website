/**
 * Downloads every desktop file the download page offers (src/releases.ts)
 * from the published site and compares its SHA-256 and size with the page.
 * Run after a publish:
 *   node --experimental-strip-types scripts/check-downloads.mjs https://zrzur.com
 * Exit code 1 when a file is missing or differs.
 */
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

/**
 * @param {string} origin
 * @param {{ url: string, sha256: string, size: number }[]} files
 * @param {typeof fetch} [get]
 * @returns {Promise<string[]>} the problems
 */
export async function checkDownloads(origin, files, get = fetch) {
  const problems = [];
  for (const file of files) {
    const at = origin.replace(/\/$/, "") + file.url;
    let response;
    try {
      response = await get(at, { headers: { "user-agent": "zrzur-download-check" } });
    } catch (error) {
      problems.push(`${at}: ${error.message}`);
      continue;
    }
    if (response.status !== 200 || !response.body) {
      problems.push(`${at}: status ${response.status}`);
      continue;
    }
    const hash = createHash("sha256");
    let bytes = 0;
    for await (const chunk of response.body) {
      hash.update(chunk);
      bytes += chunk.length;
    }
    const digest = hash.digest("hex");
    const mib = Math.round(bytes / 1024 / 1024);
    if (digest !== file.sha256) problems.push(`${at}: SHA-256 ${digest}, the page shows ${file.sha256}`);
    else if (mib !== file.size) problems.push(`${at}: ${mib} MB, the page shows ${file.size} MB`);
    else console.log(`ok ${file.url} ${digest.slice(0, 16)} ${mib} MB`);
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const origin = process.argv[2];
  if (!origin) {
    console.error("usage: check-downloads.mjs <origin>");
    process.exit(2);
  }
  const { DESKTOP_DOWNLOADS } = await import("../src/releases.ts");
  const files = Object.values(DESKTOP_DOWNLOADS).flat();
  const problems = await checkDownloads(origin, files);
  for (const problem of problems) console.error(`FAIL ${problem}`);
  console.log(`download check: ${files.length} files, ${problems.length} failures`);
  process.exit(problems.length ? 1 : 0);
}
