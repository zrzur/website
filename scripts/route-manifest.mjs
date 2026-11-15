/**
 * The route manifest: every page of zrzur.com in every language it exists
 * in, with its canonical URL, its hreflang set, its language and direction.
 * Built from the same sources as the pages (src/i18n.ts, src/legal.ts,
 * content/blog, src/seo.ts), so a new page or language shows up here, in the
 * sitemap and in the checks (scripts/site-check.mjs) at once.
 *
 * src/blog-languages.ts must be current (scripts/generate-sitemap.mjs writes
 * it first). Run with node --experimental-strip-types.
 */
import { readPosts } from "./blog-files.mjs";

const { LOCALES, localizedPath } = await import("../src/i18n.ts");
const { legalDocuments } = await import("../src/legal.ts");
const { canonicalUrl } = await import("../src/config.ts");
const { pageLanguages } = await import("../src/seo.ts");

/** The site paths (without language prefix), in sitemap order */
export function sitePaths(posts = readPosts()) {
  return [
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
}

/**
 * @returns {{ path: string, code: string, tag: string, dir: string, url: string,
 *   alternates: { hreflang: string, href: string }[] }[]}
 */
export function routeManifest(posts = readPosts()) {
  const routes = [];
  for (const path of sitePaths(posts)) {
    const languages = LOCALES.filter((locale) => pageLanguages(path).includes(locale.code));
    const alternates = languages.map((locale) => ({ hreflang: locale.tag, href: canonicalUrl(localizedPath(path, locale.code)) }));
    alternates.push({ hreflang: "x-default", href: canonicalUrl(localizedPath(path, "en")) });
    for (const locale of languages)
      routes.push({
        path,
        code: locale.code,
        tag: locale.tag,
        dir: locale.dir,
        url: canonicalUrl(localizedPath(path, locale.code)),
        alternates,
      });
  }
  return routes;
}
