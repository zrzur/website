/**
 * Write public/sitemap.xml: every page in every listed language, each entry
 * with its hreflang alternates and an x-default (English at the root).
 * Also writes src/blog-languages.ts first: the languages each post is
 * written in, so a post without a translation points at its English page.
 * Usage: node --experimental-strip-types scripts/generate-sitemap.mjs
 */
import { writeFileSync } from "node:fs";

import { readPosts } from "./blog-files.mjs";

const posts = readPosts();
const ORDER = ["en", "de", "ar", "fr", "es", "ru", "zh"];
const languagesOf = Object.fromEntries(
  posts.map((post) => [post.slug, ORDER.filter((code) => post.text[code])]),
);
writeFileSync(
  new URL("../src/blog-languages.ts", import.meta.url),
  `// Written by scripts/generate-sitemap.mjs from content/blog; do not edit by hand.\n`
    + `/** The languages each blog post is written in */\n`
    + `export const postLanguages: Record<string, readonly string[]> = ${JSON.stringify(languagesOf, null, 2)};\n`,
);

// read after the file above, so the page languages include every post
const { LOCALES, localizedPath } = await import("../src/i18n.ts");
const { legalDocuments } = await import("../src/legal.ts");
const { canonicalUrl } = await import("../src/config.ts");
const { pageLanguages } = await import("../src/seo.ts");

const pages = [
  "/",
  "/features",
  "/project",
  "/download",
  "/guide",
  "/blog",
  ...posts.map((post) => `/blog/${post.slug}`),
  "/legal",
  "/report",
  ...legalDocuments.map((doc) => `/legal/${doc.slug}`),
];
// the same canonical form the pages announce (no trailing slash)
const url = (path, code) => canonicalUrl(localizedPath(path, code));

/**
 * The date a page last really changed, where we know it: a policy carries
 * the date of its version, a post its own date. Other pages give none, since
 * a build date would claim changes that did not happen.
 */
function lastModified(page) {
  const doc = legalDocuments.find((entry) => page === `/legal/${entry.slug}`);
  if (doc) return doc.version;
  const post = posts.find((entry) => page === `/blog/${entry.slug}`);
  if (post) return post.date;
  if (page === "/legal") return legalDocuments.map((entry) => entry.version).sort().at(-1);
  return null;
}

const entries = [];
// a policy shown in English under another prefix is not listed there (src/seo.ts)
for (const page of pages)
  for (const { code } of LOCALES.filter((locale) => pageLanguages(page).includes(locale.code))) {
    const alternates = LOCALES.filter((locale) => pageLanguages(page).includes(locale.code)).map(
      (locale) => `    <xhtml:link rel="alternate" hreflang="${locale.tag}" href="${url(page, locale.code)}"/>`,
    );
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page, "en")}"/>`);
    const modified = lastModified(page);
    entries.push(`  <url>\n    <loc>${url(page, code)}</loc>\n${modified ? `    <lastmod>${modified}</lastmod>\n` : ""}${alternates.join("\n")}\n  </url>`);
  }

writeFileSync(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`,
);
console.log(`${entries.length} URLs`);
