import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

import { features } from "../src/content.ts";
import { LOCALES } from "../src/i18n.ts";
import { validatePublicUrl, resolveAppUrl, resolvePreviewUrl } from "../src/config.ts";
import { legalDocuments, legalDraftNotice } from "../src/legal.ts";

const packs = Object.fromEntries(
  await Promise.all(LOCALES.map(async ({ code }) => [code, (await import(`../src/locales/${code}.ts`)).default])),
);
const labels = Object.fromEntries(LOCALES.map(({ code }) => [code, packs[code].labels]));

test("English and Arabic cover the same complete content", () => {
  assert.deepEqual(
    Object.keys(labels.ar).sort(),
    Object.keys(labels.en).sort(),
  );
  for (const lang of ["ar", "en"]) {
    for (const value of Object.values(labels[lang]))
      assert(value.trim().length > 0);
    for (const feature of features)
      for (const field of ["title", "body"])
        assert(packs[lang].features[feature.id][field].trim());
    for (const faq of packs[lang].faqs) {
      assert(faq.question.trim());
      assert(faq.answer.trim());
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
// Owner decisions 2026-11-01: the site shows real screens of the app (captured
// from the running app with demo accounts), no
// illustrations or stock pictures; every screen exists in each site language
// and in the app's dark and light themes (no CSS filters faking a theme).
test("product pictures are real app screens in every language and theme", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert(!app.includes("ScreenshotGallery"), "Image gallery must not return");
  // the only product <img> is the Shot component, fed by its file() helper;
  // blog posts show their own pictures (class blog-cover / blog-image)
  assert.equal((app.match(/<img\b(?![^>]*class="blog-)/g) ?? []).length, 1, "one product <img>, inside Shot");
  assert.match(app, /src=\{file\(shade, !!props\.phone\)\}/);
  assert.match(app, /`\$\{code\(\)\}-\$\{props\.view\}/);
  // a new capture gets a new address (content hash), so no cache keeps the old one
  assert.match(app, /`\/assets\/product\/\$\{name\}\$\{version \? `\?v=\$\{version\}` : ""\}`/);
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
  const theme = await readFile(new URL("../public/theme.js", import.meta.url), "utf8");
  assert.match(theme, /var theme = "dark"/);
  assert.doesNotMatch(theme, /prefers-color-scheme/);
});

// The page policy (Content-Security-Policy in the zrzur.com Caddy block) has
// script-src 'self' without 'unsafe-inline': every page loads its scripts as
// files. Only JSON data blocks (application/ld+json) may be inline.
test("no page has an inline script; the theme script is a file in the head", async () => {
  for (const file of ["index.html", "about.html", "download.html", "features.html", "404.html"]) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
      const data = /type="application\/(ld\+)?json"/.test(tag);
      assert.ok(/\bsrc="/.test(tag) || data, `${file}: inline script ${tag}`);
    }
    assert.doesNotMatch(html, /\son[a-z]+="/, `${file}: inline event handler`);
  }
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const head = index.slice(0, index.indexOf("</head>"));
  assert.match(head, /<script src="\/theme\.js"><\/script>/);
  const prerender = await readFile(new URL("../scripts/prerender.mjs", import.meta.url), "utf8");
  for (const [tag] of prerender.matchAll(/<script\b[^>]*>/g))
    assert.match(tag, /application\/ld\+json/, `prerender adds ${tag}`);
});

// Owner, 2026-11-08: the Windows desktop app is offered for download. The copy
// promises nothing that does not exist yet (no other platforms or stores) and
// shows no prices or paid extras.
test("launch copy: only what exists, no prices, no paid extras", async () => {
  const copy = JSON.stringify(packs);
  // the desktop app exists for Windows, macOS and Linux; there are no phone stores
  assert.doesNotMatch(copy, /App Store|Play Store|Feather|ريشة/);
  assert.doesNotMatch(copy, /Nothing to install|Nichts zu installieren|لا حاجة إلى التثبيت|لا تثبيت/);
  for (const language of ["ar", "en", "de"])
    assert.doesNotMatch(labels[language].heroBody, /Download|تنزيل/);
  for (const [language, word] of [["fr", /Télécharg/], ["es", /Descarg/], ["ru", /Скача/], ["zh", /下载/]])
    assert.doesNotMatch(labels[language].heroBody, word, language);
  // every system the copy names has a real file, each with its own checksum
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  for (const file of [/Zrzur-win32-x64-[\w.-]+\.zip/, /Zrzur-darwin-arm64-[\w.-]+\.zip/, /Zrzur-darwin-x64-[\w.-]+\.zip/, /Zrzur-linux-x64-[\w.-]+\.zip/])
    assert.match(app, new RegExp(`url: "/downloads/${file.source}", sha256: "[0-9a-f]{64}"`), file.source);
  const sums = app.match(/sha256: "([0-9a-f]{64})"/g) ?? [];
  assert.equal(new Set(sums).size, sums.length, "each file has its own checksum");
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
    "plex-cyrillic-wght.woff2",
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
  // every listed language, not only the first three
  assert.equal(canonicalUrl("/fr/about"), "https://zrzur.com/fr/project");
  assert.equal(canonicalUrl("/zh/index.html"), "https://zrzur.com/zh");
  assert.equal(canonicalUrl("/ru/legal/privacy/"), "https://zrzur.com/ru/legal/privacy");
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


test("explicit preview destinations stay restricted to loopback", () => {
  assert.equal(resolvePreviewUrl("127.0.0.1", "http://127.0.0.1:31060/"), "http://127.0.0.1:31060/");
  assert.equal(resolvePreviewUrl("zrzur.com", "http://127.0.0.1:31060/"), null);
  assert.equal(resolvePreviewUrl("127.0.0.1", "http://example.com/"), null);
  assert.equal(resolvePreviewUrl("127.0.0.1", "http://user:password@127.0.0.1/"), null);
});
