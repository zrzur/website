// The page checks of scripts/site-check.mjs, and the route manifest it uses.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { checkPage, sitemapUrls } from "../scripts/site-check.mjs";
import { routeManifest } from "../scripts/route-manifest.mjs";

const route = {
  url: "https://zrzur.com/ar/download",
  tag: "ar",
  dir: "rtl",
  alternates: [
    { hreflang: "en", href: "https://zrzur.com/download" },
    { hreflang: "ar", href: "https://zrzur.com/ar/download" },
    { hreflang: "x-default", href: "https://zrzur.com/download" },
  ],
};
const good = `<!doctype html><html lang="ar" dir="rtl"><head><title>تنزيل زرزور</title>
<link rel="canonical" href="https://zrzur.com/ar/download" />
<link rel="alternate" hreflang="en" href="https://zrzur.com/download" />
<link rel="alternate" hreflang="ar" href="https://zrzur.com/ar/download" />
<link rel="alternate" hreflang="x-default" href="https://zrzur.com/download" />
</head><body><a href="https://github.com/zrzur">x</a></body></html>`;

test("a correct page passes", () => {
  assert.deepEqual(checkPage(good, route), []);
});

test("each kind of mistake is reported", () => {
  const cases = [
    [good.replace('lang="ar"', 'lang="en"'), /lang is "en"/],
    [good.replace('dir="rtl"', 'dir="ltr"'), /dir is "ltr"/],
    [good.replace('canonical" href="https://zrzur.com/ar/download"', 'canonical" href="https://zrzur.com/ar/download/"'), /canonical/],
    [good.replace(/<link rel="alternate" hreflang="x-default"[^>]*>/, ""), /hreflang set differs/],
    [good.replace("<title>تنزيل زرزور</title>", "<title> </title>"), /no title/],
    [good.replace("<body>", "<body>lorem ipsum"), /placeholder/],
    [good.replace('href="https://github.com/zrzur"', 'href="https\\://github.com/zrzur"'), /placeholder|backslash/],
    [good.replace('href="https://github.com/zrzur"', 'href="https://github.com\\zrzur"'), /backslash/],
  ];
  for (const [html, expected] of cases) {
    const problems = checkPage(html, route);
    assert.ok(problems.some((p) => expected.test(p)), `expected ${expected} in ${JSON.stringify(problems)}`);
  }
});

test("the app dialog text fails a page when it is banned (a build with an app address)", () => {
  const dialog = "The public web app address has not been switched on yet.";
  const html = good.replace("<body>", `<body><p>${dialog}</p>`);
  assert.deepEqual(checkPage(html, route), []);
  assert.match(checkPage(html, route, { banned: [dialog] }).join("\n"), /placeholder text/);
});

test("the route manifest is the sitemap: same URLs, every language of every page", () => {
  const routes = routeManifest();
  const listed = sitemapUrls(readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"));
  assert.deepEqual(routes.map((r) => r.url).sort(), [...listed].sort());
  // the main pages exist in all seven languages, with a right-to-left Arabic page
  for (const path of ["/", "/download", "/features", "/project"]) {
    const of = routes.filter((r) => r.path === path);
    assert.equal(of.length, 7, path);
    assert.equal(of.find((r) => r.code === "ar")?.dir, "rtl");
    assert.equal(of[0].alternates.length, 8, `${path}: 7 languages + x-default`);
  }
});
