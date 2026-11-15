// /source shows what really runs (ZR-003) and one product version (ZR-002):
// the browser script's rules, the page's live rows, and the live-check rules.
import assert from "node:assert/strict";
import test from "node:test";

import { linksOf, readLive, statusOf } from "../scripts/source-runtime.mjs";
import { renderSourcePage, sourcePages, sourceRows } from "../scripts/source-page.mjs";
import { runningProblems } from "../scripts/site-check.mjs";
import { PRODUCT_VERSION, RELEASES } from "../src/releases.ts";
import { LOCALES } from "../src/i18n.ts";

const A = "a".repeat(40);

test("a service's answer is shown only with a version and a full commit", () => {
  assert.deepEqual(readLive({ zrzur: "26.1.0-beta.2", commit: A }, "zrzur"), { version: "26.1.0-beta.2", commit: A });
  assert.deepEqual(readLive({ version: "26.1.0", commit: A.toUpperCase() }, "version"), { version: "26.1.0", commit: A });
  assert.equal(readLive({ zrzur: "26.1.0-beta.2", commit: "abc1234" }, "zrzur"), null, "short commit");
  assert.equal(readLive({ zrzur: "26.1.0-beta.2" }, "zrzur"), null, "no commit (an old server)");
  assert.equal(readLive({ version: "dev", commit: A }, "version"), null, "not a version");
  assert.equal(readLive(null, "zrzur"), null);
  assert.equal(readLive({ zrzur: "<b>x</b>", commit: A }, "zrzur"), null, "markup is never shown");
});

test("links name the running commit; the status line follows the answers", () => {
  assert.deepEqual(linksOf("web", A), { tree: `https://github.com/zrzur/web/tree/${A}`, archive: `https://github.com/zrzur/web/archive/${A}.tar.gz` });
  assert.equal(statusOf([true, true]), "live");
  assert.equal(statusOf([true, false]), "partial");
  assert.equal(statusOf([false, false]), "partial");
  assert.equal(statusOf([]), "fallback");
});

test("one product version: the desktop download names it; web and server are read live", () => {
  assert.match(PRODUCT_VERSION, /^\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/);
  assert.equal(RELEASES.desktop.version, PRODUCT_VERSION);
  assert.equal(RELEASES.web.live.url, "https://app.zrzur.com/build.json");
  assert.equal(RELEASES.backend.live.url, "https://api.zrzur.com/");
  assert.equal(RELEASES.desktop.live, undefined, "the desktop app is a download, not a running service");
});

test("every /source page reads the services and says where its values come from", async () => {
  const rows = sourceRows({ version: "0.5.0", commit: "e".repeat(40) }, RELEASES);
  for (const { code, tag, dir } of LOCALES) {
    const labels = (await import(`../src/locales/${code}.ts`)).default.labels;
    for (const key of ["sourceFallback", "sourceLive", "sourcePartial"]) assert(labels[key]?.trim(), `${code} ${key}`);
    const [page] = sourcePages([{ code, tag, dir }], () => labels);
    const html = renderSourcePage(page, rows);
    assert(html.includes('<script type="module" src="/source.js"></script>'), code);
    assert(html.includes(`data-live="https://app.zrzur.com/build.json" data-version-key="version" data-repo="web"`), code);
    assert(html.includes(`data-live="https://api.zrzur.com/" data-version-key="zrzur" data-repo="backend"`), code);
    // the status starts as "from the build" and carries the other two texts for the script
    const status = html.match(/<p class="status" id="source-status"[^>]*>([^<]*)<\/p>/);
    assert(status, code);
    assert.equal(status[1].replace(/&#39;|&quot;|&amp;/g, (m) => ({ "&#39;": "'", "&quot;": '"', "&amp;": "&" })[m]), labels.sourceFallback, code);
    assert(!/data-live="[^"]*" data-version-key="[^"]*" data-repo="desktop"/.test(html), `${code}: desktop row is not live`);
  }
});

test("the live check fails when a running part disagrees with /source's rules", () => {
  const part = { repo: "backend", url: "https://api.zrzur.com/", versionKey: "zrzur" };
  const ok = { status: 200, allowOrigin: "https://zrzur.com", json: { zrzur: PRODUCT_VERSION, commit: A }, public: true };
  assert.deepEqual(runningProblems(part, ok, PRODUCT_VERSION, readLive), []);
  const cases = [
    [{ ...ok, status: 404, json: null }, /status 404/],
    [{ ...ok, allowOrigin: null }, /may not read it/],
    [{ ...ok, json: { zrzur: PRODUCT_VERSION } }, /no full commit/],
    [{ ...ok, json: { zrzur: "26.1.0-beta.1", commit: A } }, /runs 26\.1\.0-beta\.1, the product version is/],
    [{ ...ok, public: false }, /not public/],
  ];
  for (const [answer, expected] of cases) {
    const problems = runningProblems(part, answer, PRODUCT_VERSION, readLive);
    assert(problems.some((p) => expected.test(p)), `${expected}: ${JSON.stringify(problems)}`);
  }
  // GitHub not reachable is not a failure of the site
  assert.deepEqual(runningProblems(part, { ...ok, public: null }, PRODUCT_VERSION, readLive), []);
});
