// public/theme.js runs before the first paint, in the page head. It picks the
// theme, sends a visitor of another language from an English address to
// their own address before anything is drawn, preloads the words and the
// first picture of the page, and catches taps until the app takes over.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../public/theme.js", import.meta.url), "utf8");

/** Runs theme.js against a small fake page and returns what it did */
function run({ pathname = "/", search = "", hash = "", saved = {}, languages = ["en-US"], meta = {} } = {}) {
  const appended = [];
  const listeners = [];
  const replaced = [];
  const element = (tag) => ({ tagName: tag, setAttribute(name, value) { this[name] = value; } });
  const document = {
    documentElement: { dataset: {}, lang: "", dir: "" },
    head: { appendChild: (node) => appended.push(node) },
    createElement: element,
    querySelector: (selector) => {
      const name = selector.match(/meta\[name="([^"]+)"\]/)?.[1];
      return name && meta[name] ? { content: meta[name] } : null;
    },
    addEventListener: (type, listener, options) => listeners.push({ type, options }),
  };
  const window = {
    document,
    location: { pathname, search, hash, replace: (url) => replaced.push(url) },
    navigator: { languages },
    localStorage: { getItem: (key) => saved[key] ?? null },
  };
  window.window = window;
  window.self = window;
  runInNewContext(source, window);
  return { window, document, appended, listeners, replaced };
}

test("an English address sends a visitor of another language to their own address before the paint", () => {
  assert.deepEqual(run({ pathname: "/features", languages: ["de-DE", "en"] }).replaced, ["/de/features"]);
  assert.deepEqual(run({ pathname: "/", languages: ["fr-CA"] }).replaced, ["/fr/"]);
  assert.deepEqual(run({ pathname: "/legal/privacy", search: "?a=1", hash: "#x", languages: ["ru"] }).replaced, ["/ru/legal/privacy?a=1#x"]);
  // the saved choice comes first, English included
  assert.deepEqual(run({ pathname: "/download", saved: { "zrzur-site-language": "es" }, languages: ["de"] }).replaced, ["/es/download"]);
  assert.deepEqual(run({ pathname: "/download", saved: { "zrzur-site-language": "en" }, languages: ["de"] }).replaced, []);
  // Simplified Chinese only; traditional script falls through to the next language
  assert.deepEqual(run({ pathname: "/", languages: ["zh-CN"] }).replaced, ["/zh/"]);
  assert.deepEqual(run({ pathname: "/", languages: ["zh-TW", "de"] }).replaced, ["/de/"]);
  assert.deepEqual(run({ pathname: "/", languages: ["zh-Hant-HK"] }).replaced, []);
  // English visitors and prefixed addresses stay where they are
  assert.deepEqual(run({ pathname: "/", languages: ["en-GB", "de"] }).replaced, []);
  assert.deepEqual(run({ pathname: "/fr/features", languages: ["de"] }).replaced, []);
  assert.deepEqual(run({ pathname: "/", languages: ["it-IT"] }).replaced, []);
});

test("the theme and direction are set before the paint", () => {
  const light = run({ pathname: "/ar/", saved: { "zrzur-site-theme": "light" } });
  assert.equal(light.document.documentElement.dataset.theme, "light");
  assert.equal(light.document.documentElement.dir, "rtl");
  assert.equal(run({ pathname: "/zh/" }).document.documentElement.lang, "zh-Hans");
  assert.equal(run({}).document.documentElement.dataset.theme, "dark");
});

test("taps before the app takes over are kept for it", () => {
  const { window, listeners } = run({ pathname: "/fr/" });
  assert(Array.isArray(window._$HY.events) && window._$HY.completed && window._$HY.r);
  for (const type of ["click", "input"]) assert(listeners.some((l) => l.type === type), type);
});

test("the shown shade of the first picture is preloaded, the other never", () => {
  const hero = JSON.stringify({
    dark: [{ media: "(max-width: 600px)", type: "image/avif", href: "/d-phone.avif" }, { media: "(min-width: 601px)", type: "image/avif", srcset: "/d-1152.avif 1152w, /d-2304.avif 2304w", sizes: "100vw" }],
    light: [{ media: "(max-width: 600px)", type: "image/avif", href: "/l-phone.avif" }],
  });
  const images = (result) => result.appended.filter((node) => node.as === "image");
  const dark = images(run({ pathname: "/fr/", meta: { "zrzur-hero": hero } }));
  assert.deepEqual(dark.map((n) => n.href ?? n.imagesrcset), ["/d-phone.avif", "/d-1152.avif 1152w, /d-2304.avif 2304w"]);
  assert(dark.every((n) => n.fetchpriority === "high" && n.type === "image/avif" && n.media));
  assert.equal(dark[1].imagesizes, "100vw");
  const light = images(run({ pathname: "/fr/", saved: { "zrzur-site-theme": "light" }, meta: { "zrzur-hero": hero } }));
  assert.deepEqual(light.map((n) => n.href), ["/l-phone.avif"]);
  // a visitor being sent to their own address preloads nothing here
  assert.equal(images(run({ pathname: "/", languages: ["de"], meta: { "zrzur-hero": hero } })).length, 0);
});
