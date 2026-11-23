/**
 * The download page may only be published with the real release files: the
 * desktop commit, the SHA-256 and size of every file (src/releases.ts), and
 * the owner's screenshot in every slot (src/shots.ts).
 * In CI (the publish job sets CI=true) a pending release stops the build;
 * on a computer it only warns, so the page can be drafted and checked.
 *   node --experimental-strip-types scripts/check-release-ready.mjs
 */
import { pathToFileURL } from "node:url";

/**
 * Every screenshot slot needs the owner's shot in Arabic and English (and
 * M2 in German, for the phones that show one screen in three languages):
 * a visitor must never see an empty frame with an internal code like "D1".
 */
export function slotProblems(slots, shots) {
  const problems = [];
  for (const id of Object.keys(slots))
    for (const code of id === "m2" ? ["ar", "en", "de"] : ["ar", "en"])
      if (!shots[`${code}-${id}`]) problems.push(`no screenshot ${code}-${id} (src/shots.ts)`);
  return problems;
}

/** What is still missing, as plain lines */
export function releaseProblems(pending, downloads) {
  const problems = [];
  if (pending) problems.push("DESKTOP_RELEASE_PENDING is still true in src/releases.ts");
  for (const file of Object.values(downloads).flat()) {
    if (!/^[0-9a-f]{64}$/.test(file.sha256 ?? "")) problems.push(`${file.url}: no SHA-256`);
    if (!(file.size > 0)) problems.push(`${file.url}: no size`);
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { DESKTOP_DOWNLOADS, DESKTOP_RELEASE_PENDING } = await import("../src/releases.ts");
  const { SLOTS, SHOTS } = await import("../src/shots.ts");
  const problems = [...releaseProblems(DESKTOP_RELEASE_PENDING, DESKTOP_DOWNLOADS), ...slotProblems(SLOTS, SHOTS)];
  if (problems.length && process.env.CI) {
    console.error(`The release is not ready to publish:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  if (problems.length) console.warn(`draft build: the release is not filled in yet (${problems.length} items); CI refuses it`);
}
