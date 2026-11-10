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
    documentElement: { dataset: {}, lang: "", dir: "", style: {} },
    head: { appendChild: (node) => appended.push(node) },
    createElement: element,
    querySelector: (selector) => {
      const name = selector.match(/meta\[name="([^"]+)"\]/)?.[1];
      return name && meta[name] ? { content: meta[name] } : null;
    },
    addEventListener: (type, listener, options) => listeners.push({ type, options }),
  };
  const frames = [];
  const window = {
    requestAnimationFrame: (callback) => frames.push(callback),
    setTimeout: (callback) => callback(),
    document,
    URL,
    location: { pathname, search, hash, origin: "https://zrzur.com", replace: (url) => replaced.push(url) },
    navigator: { languages },
    localStorage: { getItem: (key) => saved[key] ?? null },
  };
  window.window = window;
  window.self = window;
  runInNewContext(source, window);
  /** the browser paints, then runs what waited for the paint */
  const paint = () => frames.splice(0).forEach((callback) => callback());
  return { window, document, appended, listeners, replaced, paint };
}

test("the app's scripts and words are fetched after the first paint, not before", () => {
  const page = run({ pathname: "/ar/features", meta: { "zrzur-words": "en=/assets/en-1.js,ar=/assets/ar-2.js", "zrzur-preload": "/assets/i18n-3.js,/assets/icon-4.js" } });
  const scripts = () => page.appended.filter((node) => node.rel === "modulepreload").map((node) => node.href);
  assert.deepEqual(scripts(), [], "nothing competes with the stylesheet and the first paint");
  page.paint();
  assert.deepEqual(scripts(), ["/assets/ar-2.js", "/assets/i18n-3.js", "/assets/icon-4.js"]);
});

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

test("the page being left is hidden, so the English page never shows", () => {
  const leaving = run({ pathname: "/features", languages: ["de-DE"] });
  assert.equal(leaving.document.documentElement.style.visibility, "hidden");
  assert.equal(run({ pathname: "/features", languages: ["en-US"] }).document.documentElement.style.visibility, undefined);
});

test("/en/ and upper-case prefixes go to the one address of the page", () => {
  // English has no prefix: /en/x is /x, and a German browser goes straight to /de/x (never /de/en/x)
  assert.deepEqual(run({ pathname: "/en/features", languages: ["en-US"] }).replaced, ["/features"]);
  assert.deepEqual(run({ pathname: "/en", languages: ["en-US"] }).replaced, ["/"]);
  assert.deepEqual(run({ pathname: "/en/features", languages: ["de-DE"] }).replaced, ["/de/features"]);
  // prefixes are lower case
  assert.deepEqual(run({ pathname: "/DE/features", languages: ["en-US"] }).replaced, ["/de/features"]);
  assert.deepEqual(run({ pathname: "/Fr/", search: "?a=1", languages: ["de"] }).replaced, ["/fr/?a=1"]);
  assert.deepEqual(run({ pathname: "/EN/legal", languages: ["en-US"] }).replaced, ["/legal"]);
});

test("the first picture's larger shade is preloaded only above phone width", () => {
  const source = readFileSync(new URL("../src/shots.ts", import.meta.url), "utf8");
  assert(source.includes('"not all and (max-width: 600px)"'));
});

test("a crafted address never sends the visitor to another site", () => {
  // /en//evil.com must not become location.replace("//evil.com") (protocol-relative)
  for (const pathname of ["/en//evil.com", "/en/\\evil.com", "/en/\\/evil.com", "/EN//evil.com", "/en/%5Cevil.com"])
    for (const languages of [["en-US"], ["de-DE"]]) {
      const { replaced } = run({ pathname, languages });
      for (const target of replaced) {
        assert(!/^[\/\\]{2}/.test(target), `${pathname} ${languages}: ${target}`);
        assert.equal(new URL(target, "https://zrzur.com").origin, "https://zrzur.com", `${pathname}: ${target}`);
      }
      assert.equal(replaced.length, 1, pathname);
    }
  assert.deepEqual(run({ pathname: "/en//evil.com" }).replaced, ["/evil.com"]);
  assert.deepEqual(run({ pathname: "/en/\\evil.com", languages: ["de-DE"] }).replaced, ["/de/evil.com"]);
  // a doubled slash on an English address with a German browser stays on the site too
  assert.deepEqual(run({ pathname: "//evil.com", languages: ["de-DE"] }).replaced, ["/de/evil.com"]);
});
