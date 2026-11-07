import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

import { labels, features, faqs } from "../src/content.ts";
import { validatePublicUrl, resolveAppUrl } from "../src/config.ts";
import { legalDocuments, legalDraftNotice } from "../src/legal.ts";

test("English and Arabic cover the same complete content", () => {
  assert.deepEqual(
    Object.keys(labels.ar).sort(),
    Object.keys(labels.en).sort(),
  );
  for (const lang of ["ar", "en"]) {
    for (const value of Object.values(labels[lang]))
      assert(value.trim().length > 0);
    for (const feature of features)
      for (const field of ["title", "body", "detail"])
        assert(feature[field][lang].trim());
    for (const faq of faqs) {
      assert(faq.question[lang].trim());
      assert(faq.answer[lang].trim());
    }
  }
});
test("public links fail closed for upstream, credential-bearing, invalid and non-Zrzur hosts", () => {
  for (const value of [
    undefined,
    "",
    "invalid",
    "http://zrzur.com",
    "https://stoat.chat",
    "https://api.revolt.chat",
    "https://zrzur.com.evil.test",
    "https://evilzrzur.com",
    "https://user:password@zrzur.com",
    "javascript:alert(1)",
    "https://127.0.0.1",
  ])
    assert.equal(validatePublicUrl(value), null);
  assert.equal(
    validatePublicUrl("https://zrzur.com/app"),
    "https://zrzur.com/app",
  );
  assert.equal(
    validatePublicUrl("https://app.zrzur.com/"),
    "https://app.zrzur.com/",
  );
});
test("local app shortcut is restricted to loopback previews", () => {
  assert.equal(
    resolveAppUrl("127.0.0.1", undefined),
    "http://127.0.0.1:14707/",
  );
  assert.equal(
    resolveAppUrl("localhost", undefined),
    "http://127.0.0.1:14707/",
  );
  assert.equal(resolveAppUrl("zrzur.com", undefined), null);
  assert.equal(resolveAppUrl("preview.example", undefined), null);
  assert.equal(resolveAppUrl("zrzur.com", "https://stoat.chat"), null);
});
// The site shows real screens of the app, no
// illustrations or stock pictures; every screen exists in each site language
// and in the app's dark and light themes (no CSS filters faking a theme).
test("product pictures are real app screens in every language and theme", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert(!app.includes("ScreenshotGallery"), "Image gallery must not return");
  // the only <img> is the Shot component, fed by its file() helper
  assert.equal((app.match(/<img\b/g) ?? []).length, 1, "one <img>, inside Shot");
  assert.match(app, /src=\{file\(shade, !!props\.phone\)\}/);
  assert.match(app, /`\/assets\/product\/\$\{code\(\)\}-\$\{props\.view\}/);
  assert(!/filter:\s*invert/.test(await readFile(new URL("../src/site.css", import.meta.url), "utf8")));
  const views = [...app.matchAll(/<Shot view="(\w+)"/g)].map((m) => m[1]);
  assert(views.length >= 5, "the homepage shows several real screens");
  for (const language of ["ar", "en", "de"])
    for (const theme of ["dark", "light"]) {
      for (const view of new Set(views))
        await access(new URL(`../public/assets/product/${language}-${view}-${theme}.jpg`, import.meta.url));
      for (const view of ["chat", "lobby"])
        await access(new URL(`../public/assets/product/${language}-${view}-phone-${theme}.jpg`, import.meta.url));
    }
});

test("the site has no native select and dark is the default theme", async () => {
  for (const file of ["App.tsx", "demo.tsx", "report.tsx", "legal-page.tsx"]) {
    const source = await readFile(new URL(`../src/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /<select\b/, file);
  }
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /var theme = "dark"/);
  assert.doesNotMatch(html, /prefers-color-scheme/);
});

test("soft launch: no download promises, no prices, no paid extras in the marketing copy", () => {
  const copy = JSON.stringify([labels, features, faqs]);
  assert.doesNotMatch(copy, /macOS|Linux|App Store|Feather|ريشة|Download the app|نزّل التطبيق/);
  for (const language of ["ar", "en", "de"])
    assert.doesNotMatch(labels[language].heroBody, /Download|تنزيل/);
});

test("the flock fills a shape with exactly as many birds as it has", async () => {
  const { flockSize, sampleMask } = await import("../src/flock.ts");
  assert.equal(flockSize(375, 812), 634);
  assert(flockSize(4000, 2000) <= 2400, "a big screen does not mean a slow flock");
  assert(flockSize(320, 480) >= 420, "a small screen still reads as a flock");
  const inside = (x, y) => x >= 10 && x < 30 && y >= 10 && y < 30;
  const { xs, ys } = sampleMask(inside, 40, 40, 200, () => 0.5);
  assert.equal(xs.length, 200);
  for (let i = 0; i < 200; i++) {
    assert(xs[i] >= 8 && xs[i] <= 32, String(xs[i]));
    assert(ys[i] >= 8 && ys[i] <= 32, String(ys[i]));
  }
  const empty = sampleMask(() => false, 40, 40, 10, () => 0.5);
  assert.equal(empty.xs.length, 10);
});

test("the logo is the controller face B in every served place", async () => {
  // B, the laughing face, has "M 68 126"; A had the narrowed eyes (path "M 68 113")
  const logo = await readFile(new URL("../public/assets/logo.svg", import.meta.url), "utf8");
  assert.match(logo, /fill="currentColor"/);
  for (const file of ["../public/assets/logo.svg", "../public/brand/favicon.svg", "../public/assets/loader-glide.svg"]) {
    const svg = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(svg, /M 84 78 L 172 78/, `${file} is the controller face`);
    assert.match(svg, /M 68 126/, `${file} is not version B`);
    assert.doesNotMatch(svg, /M 68 113/, `${file} is version A`);
  }
  const css = await readFile(new URL("../src/site.css", import.meta.url), "utf8");
  assert.match(css, /mask: url\("\/assets\/logo\.svg"\)/);
  assert.doesNotMatch(css, /bird\.svg/);
});
test("all bundled fonts and approved marks exist", async () => {
  for (const file of [
    "logo.svg",
    "loader-glide.svg",
    "plex-arabic-400.woff2",
    "plex-arabic-600.woff2",
    "plex-arabic-700.woff2",
    "plex-latin-wght.woff2",
    "Plex-Arabic-LICENSE.txt",
    "Plex-Latin-LICENSE.txt",
    "Upstream-AGPL-LICENSE.txt",
  ])
    await access(new URL(`../public/assets/${file}`, import.meta.url));
});
test("legal documents remain explicit bilingual drafts without invented operator details", () => {
  assert.equal(legalDocuments.length, 12);
  assert(legalDraftNotice.en.includes("reviewed by a lawyer"));
  for (const doc of legalDocuments) {
    assert(doc.title.ar && doc.title.en);
    for (const section of doc.sections)
      assert(section.body.ar && section.body.en);
    assert(!JSON.stringify(doc.sections).includes("Revolt Platforms Ltd"));
    assert(!JSON.stringify(doc.sections).includes("16260658"));
  }
});

test("canonical URLs always point at the zrzur.com homepage domain", async () => {
  const { canonicalUrl } = await import("../src/config.ts");
  assert.equal(canonicalUrl("/"), "https://zrzur.com/");
  assert.equal(canonicalUrl("/features.html"), "https://zrzur.com/features");
  assert.equal(canonicalUrl("/about"), "https://zrzur.com/project");
  assert.equal(canonicalUrl("/legal/privacy/"), "https://zrzur.com/legal/privacy");
  // old aliases resolve inside a language prefix too
  assert.equal(canonicalUrl("/de/about"), "https://zrzur.com/de/project");
  assert.equal(canonicalUrl("/ar/index.html"), "https://zrzur.com/ar");
});

test("robots.txt and sitemap.xml list only zrzur.com pages", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /^Sitemap: https:\/\/zrzur\.com\/sitemap\.xml$/m);
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert(locs.includes("https://zrzur.com/"));
  for (const loc of locs) assert.match(loc, /^https:\/\/zrzur\.com\//);
  for (const doc of legalDocuments)
    assert(locs.includes(`https://zrzur.com/legal/${doc.slug}`), doc.slug);
});
