/**
 * Write public/sitemap.xml: every page in every listed language, each entry
 * with its hreflang alternates and an x-default (English at the root).
 * Usage: node --experimental-strip-types scripts/generate-sitemap.mjs
 */
import { writeFileSync } from "node:fs";

import { LOCALES, localizedPath } from "../src/i18n.ts";
import { legalDocuments } from "../src/legal.ts";
import { canonicalUrl } from "../src/config.ts";
import { readPosts } from "./blog-files.mjs";

const posts = readPosts();

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

const entries = [];
for (const page of pages)
  for (const { code } of LOCALES) {
    const alternates = LOCALES.map(
      (locale) => `    <xhtml:link rel="alternate" hreflang="${locale.tag}" href="${url(page, locale.code)}"/>`,
    );
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page, "en")}"/>`);
    entries.push(`  <url>\n    <loc>${url(page, code)}</loc>\n${alternates.join("\n")}\n  </url>`);
  }

writeFileSync(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`,
);
console.log(`${entries.length} URLs`);
