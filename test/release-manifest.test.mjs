// The release manifest (src/releases.ts) and the /source page built from it.
import assert from "node:assert/strict";
import test from "node:test";

import { DESKTOP_DOWNLOADS, RELEASES, archiveUrl, displayVersion, treeUrl } from "../src/releases.ts";
import { renderSourcePage, sourcePages, sourceRows } from "../scripts/source-page.mjs";
import { LOCALES } from "../src/i18n.ts";

const VERSION = /^\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/;

test("every part names a version and a full commit", () => {
  for (const [id, part] of Object.entries(RELEASES)) {
    assert.match(part.version, VERSION, id);
    assert.match(part.commit, /^[0-9a-f]{40}$/, id);
  }
});

test("every desktop file carries the desktop version in its name, a SHA-256 and a size", () => {
  const files = Object.values(DESKTOP_DOWNLOADS).flat();
  assert.equal(files.length, 6);
  for (const file of files) {
    assert.ok(file.url.startsWith("/downloads/"), file.url);
    assert.ok(file.url.includes(`-${RELEASES.desktop.version}`) || file.url.includes(`_${RELEASES.desktop.version}_`), `${file.url} is not ${RELEASES.desktop.version}`);
    assert.match(file.sha256, /^[0-9a-f]{64}$/, file.url);
    assert.ok(file.size > 0, file.url);
  }
  assert.equal(new Set(files.map((f) => f.sha256)).size, files.length, "two files share a checksum");
});

test("the shown version follows the manifest", () => {
  assert.equal(displayVersion("26.1.0-beta.2"), "26.1.0 Beta 2");
  assert.equal(displayVersion("26.1.0-rc.1"), "26.1.0 RC 1");
  assert.equal(displayVersion("26.1.0"), "26.1.0");
  assert.equal(treeUrl("web", "a".repeat(40)), `https://github.com/zrzur/web/tree/${"a".repeat(40)}`);
  assert.equal(archiveUrl("web", "a".repeat(40)), `https://github.com/zrzur/web/archive/${"a".repeat(40)}.tar.gz`);
});

test("the source page refuses a part without its exact commit", () => {
  assert.throws(() => sourceRows({ version: "0.5.0", commit: "" }, RELEASES), /website has no full commit/);
  assert.throws(() => sourceRows({ version: "0.5.0", commit: "b".repeat(40) }, { ...RELEASES, web: { ...RELEASES.web, commit: "abc123" } }), /web has no full commit/);
});

test("the source page lists all four parts with exact links, in every language", async () => {
  const rows = sourceRows({ version: "0.5.0", commit: "c".repeat(40) }, RELEASES);
  const packs = {};
  for (const { code } of LOCALES) packs[code] = (await import(`../src/locales/${code}.ts`)).default.labels;
  const pages = sourcePages(LOCALES, (code) => packs[code]);
  assert.equal(pages.length, 7);
  for (const page of pages) {
    const html = renderSourcePage(page, rows);
    assert.match(html, new RegExp(`<html lang="${page.lang}" dir="${page.dir}">`));
    for (const row of rows) {
      assert.ok(html.includes(`https://github.com/zrzur/${row.repo}/tree/${row.commit}`), `${page.file} ${row.repo}`);
      assert.ok(html.includes(`https://github.com/zrzur/${row.repo}/archive/${row.commit}.tar.gz`), `${page.file} ${row.repo}`);
      assert.ok(html.includes(`>${row.version}<`), `${page.file} ${row.repo} version`);
    }
    for (const key of ["source", "sourceIntro", "sourcePart", "sourceVersion", "sourceCommit", "sourceBrowse", "sourceArchive", "sourceWebsite", "sourceWebApp", "sourceServer", "sourceDesktop", "sourceAll"])
      assert.ok(page.labels[key]?.trim(), `${page.file}: ${key}`);
    assert.ok(!html.includes("undefined"), page.file);
  }
  assert.equal(pages.find((p) => p.lang === "ar")?.dir, "rtl");
});

test("the download check reports a wrong checksum, a wrong size and a missing file", async () => {
  const { checkDownloads } = await import("../scripts/check-downloads.mjs");
  const { createHash } = await import("node:crypto");
  const body = new Uint8Array(1024 * 1024); // 1 MB of zeros
  const sha = createHash("sha256").update(body).digest("hex");
  const get = async (url) =>
    url.endsWith("/missing.zip") ? new Response(null, { status: 404 }) : new Response(body, { status: 200 });
  const quiet = console.log;
  console.log = () => {};
  try {
    assert.deepEqual(await checkDownloads("https://x.test", [{ url: "/downloads/a.zip", sha256: sha, size: 1 }], get), []);
    const problems = await checkDownloads("https://x.test", [
      { url: "/downloads/b.zip", sha256: "0".repeat(64), size: 1 },
      { url: "/downloads/c.zip", sha256: sha, size: 5 },
      { url: "/downloads/missing.zip", sha256: sha, size: 1 },
    ], get);
    assert.equal(problems.length, 3);
    assert.match(problems[0], /SHA-256/);
    assert.match(problems[1], /1 MB, the page shows 5 MB/);
    assert.match(problems[2], /status 404/);
  } finally {
    console.log = quiet;
  }
});
