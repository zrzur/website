/**
 * After `vite build`: one ready HTML file per page and language, so search
 * engines and link previews read the right language, title, description,
 * canonical and alternates without running the app, plus structured data
 * (what Zrzur is, the questions, the blog posts) and the page's own words in
 * plain HTML. The app replaces that HTML when it starts (src/main.tsx).
 *
 * The server tries {path}, {path}.html, {path}/index.html, then /index.html,
 * so /ar/features is written as dist/ar/features.html and / stays index.html.
 * Usage: node --experimental-strip-types scripts/prerender.mjs
 */
import { mkdirSync, readFileSync, readdirSync, renameSync, rmdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { readPosts } from "./blog-files.mjs";
import { postText } from "../src/blog-posts.ts";
import { LOCALES, localizedPath, tagOf } from "../src/i18n.ts";
import { canonicalUrl } from "../src/config.ts";
import { legalDocuments } from "../src/legal.ts";
import { localize } from "../src/content.ts";
import { canonicalLanguage, pageLanguages } from "../src/seo.ts";

/**
 * The app renders each page here exactly as the browser will draw it
 * (`vite build --ssr src/entry-server.tsx` → build/ssr). It reads the
 * address and a few page properties at render time; this is all it needs.
 */
const serverPage = (pathname) => {
  globalThis.location = { pathname, hostname: "zrzur.com", search: "", hash: "", origin: SITE_ORIGIN_FOR_SSR };
  globalThis.document = { documentElement: { dataset: {} } };
  globalThis.history = { replaceState() {}, pushState() {} };
};
const SITE_ORIGIN_FOR_SSR = "https://zrzur.com";
const { renderPage } = await import(new URL("../build/ssr/entry-server.js", import.meta.url).href);

const posts = readPosts();
/** every language's words, straight from src/locales/<code>.ts */
const packs = Object.fromEntries(
  await Promise.all(LOCALES.map(async ({ code }) => [code, (await import(`../src/locales/${code}.ts`)).default])),
);
const labels = Object.fromEntries(LOCALES.map(({ code }) => [code, packs[code].labels]));
/** a post in the page language, or English when it has no file in it */
const textOf = (post, code) => postText(post, code).text;

const dist = new URL("../dist/", import.meta.url);
const built = readFileSync(new URL("index.html", dist), "utf8");
// a second run would read its own English page as the shell: build first
if (built.includes("data-prerendered")) throw new Error("dist/index.html is already prerendered: run vite build first");
/**
 * The stylesheet is the one thing the first paint waits for: it is asked for
 * right after the theme script, before the app's scripts, which the page does
 * not need to show itself (Vite puts it after them).
 */
const stylesheet = built.match(/\s*<link rel="stylesheet"[^>]*>/)?.[0];
const THEME = '<script src="/theme.js"></script>';
if (!stylesheet || !built.includes(THEME)) throw new Error("index.html: stylesheet or theme script not found");
/**
 * The page shows itself without script; the app only takes it over. So its
 * scripts must not compete with the stylesheet: the entry is fetched at low
 * priority and its own imports load when it runs (no modulepreload links).
 */
const shell = built
  .replace(stylesheet, "")
  .replace(THEME, `${THEME}${stylesheet}`)
  .replace(/\s*<link rel="modulepreload"[^>]*>/g, "")
  .replace('<script type="module" crossorigin', '<script type="module" fetchpriority="low" crossorigin');
if (!shell.includes('fetchpriority="low"')) throw new Error("index.html: the app's script tag changed");
const SITE = "https://zrzur.com";
const OG_LOCALE = { en: "en_US", de: "de_DE", ar: "ar_AR", fr: "fr_FR", es: "es_ES", ru: "ru_RU", zh: "zh_CN" };

/**
 * The chunk with a language's words, from Vite's manifest: the page preloads
 * it next to the app, so the words never wait for the app to ask for them.
 */
const manifest = JSON.parse(readFileSync(new URL(".vite/manifest.json", dist), "utf8"));
const chunkOf = (source) => {
  const entry = manifest[source];
  if (!entry) throw new Error(`${source} is not in the build manifest`);
  return `/${entry.file}`;
};
const packChunk = Object.fromEntries(LOCALES.map(({ code }) => [code, chunkOf(`src/locales/${code}.ts`)]));
/**
 * Where each language's words are, for public/theme.js: it preloads the
 * chunk of the address's language before the app asks for it. A meta tag,
 * not a script: the page policy allows no inline script. Every page carries
 * it, the /index.html fallback of unknown addresses too.
 */
const wordsMeta = `<meta name="zrzur-words" content="${LOCALES.map(({ code }) => `${code}=${packChunk[code]}`).join(",")}" />`;
if (!shell.includes('<meta charset="utf-8" />')) throw new Error("index.html: the charset meta moved; the words map goes right after it");

const esc = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (path, code) => canonicalUrl(localizedPath(path, code));
const feedPath = (code) => `${code === "en" ? "" : `/${code}`}/blog/feed.xml`;
/** title, description and post of each page, in the language of the page */
function pageWords(path, code) {
  const t = labels[code];
  const post = path.startsWith("/blog/") ? posts.find((entry) => `/blog/${entry.slug}` === path) : null;
  const doc = legalDocuments.find((entry) => path === `/legal/${entry.slug}`);
  const of = (title, description) => ({ title: `${title} — ${t.brand}`, description });
  if (path === "/") return { title: t.seoHomeTitle, description: t.seoHomeBody };
  if (path === "/features") return of(t.features, t.featuresBody);
  if (path === "/project") return of(t.project, t.projectBody);
  if (path === "/download") return of(t.downloadTitle, t.downloadBody);
  if (path === "/guide") return of(t.help, t.helpBody);
  if (path === "/blog") return of(t.blog, t.blogBody);
  if (post) return { ...of(textOf(post, code).title, textOf(post, code).summary), post };
  if (path === "/report") return of(t.reportTitle, t.reportIntro);
  if (path === "/legal") return of(t.legalTitle, t.legalIntro);
  if (doc) return of(localize(doc.title, code), localize(doc.intro, code));
  throw new Error(`no words for ${path}`);
}

/** structured data: who we are, what the app is, and what the page holds */
function structured(path, code, words) {
  const t = labels[code];
  const org = { "@type": "Organization", "@id": `${SITE}/#org`, name: "Zrzur", alternateName: "زرزور", url: SITE, logo: `${SITE}/brand/icon-512.png`, sameAs: ["https://github.com/zrzur"] };
  const graph = [org, { "@type": "WebSite", "@id": `${SITE}/#site`, name: "Zrzur", alternateName: "زرزور", url: SITE, inLanguage: LOCALES.map((l) => l.tag), publisher: { "@id": `${SITE}/#org` } }];
  if (path === "/" || path === "/download")
    graph.push({
      "@type": "SoftwareApplication",
      name: "Zrzur",
      alternateName: "زرزور",
      applicationCategory: "CommunicationApplication",
      operatingSystem: "Windows, macOS, Linux, Web",
      url: url("/", code),
      downloadUrl: url("/download", code),
      description: t.seoHomeBody,
      inLanguage: tagOf(code),
      isAccessibleForFree: true,
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: { "@id": `${SITE}/#org` },
    });
  if (path === "/guide")
    graph.push({ "@type": "FAQPage", inLanguage: tagOf(code), mainEntity: packs[code].faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) });
  if (words.post)
    graph.push({
      "@type": "BlogPosting",
      headline: textOf(words.post, code).title,
      description: textOf(words.post, code).summary,
      datePublished: words.post.date,
      dateModified: words.post.date,
      wordCount: textOf(words.post, code).words,
      keywords: textOf(words.post, code).tags.join(", "),
      inLanguage: tagOf(postText(words.post, code).language),
      mainEntityOfPage: url(path, code),
      author: { "@id": `${SITE}/#org` },
      publisher: { "@id": `${SITE}/#org` },
      image: `${SITE}${words.post.cover ?? "/brand/og-image.png"}`,
    });
  // the JSON may not close the script element early
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

async function page(path, code) {
  const words = pageWords(path, code);
  const dir = LOCALES.find((l) => l.code === code).dir;
  const languages = LOCALES.filter((l) => pageLanguages(path).includes(l.code));
  serverPage(localizedPath(path, code));
  // the hydration keys stay: the app takes these very nodes over (src/main.tsx).
  // Solid adds its resource data as an inline script element; the page policy
  // allows no inline script, and the one page with a resource (the report
  // form) is drawn afresh instead of taken over
  const app = (await renderPage(localizedPath(path, code), code)).replace(/<(script)>[\s\S]*?<\/\1>/g, "");
  if (/<(script)\b/.test(app)) throw new Error(`${path} ${code}: the rendered page carries a script`);
  const head = [
    `<link rel="canonical" href="${esc(url(path, canonicalLanguage(path, code)))}" />`,
    ...languages.map((l) => `<link rel="alternate" hreflang="${l.tag}" href="${esc(url(path, l.code))}" />`),
    `<link rel="alternate" hreflang="x-default" href="${esc(url(path, "en"))}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[code]}" />`,
    ...languages.filter((l) => l.code !== code).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l.code]}" />`),
    `<meta name="twitter:title" content="${esc(words.title)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${esc(`${labels[code].blog} — ${labels[code].brand}`)}" href="${esc(feedPath(code))}" />`,
    ...(words.post ? [`<meta property="article:published_time" content="${words.post.date}" />`, ...textOf(words.post, code).tags.map((tag) => `<meta property="article:tag" content="${esc(tag)}" />`)] : []),
    `<meta name="twitter:description" content="${esc(words.description)}" />`,
    `<script type="application/ld+json">${structured(path, code, words)}</script>`,
  ].join("\n    ");
  let html = shell
    .replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n    ${wordsMeta}`)
    .replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${tagOf(code)}" dir="${dir}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(words.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(words.description)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(words.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(words.description)}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${esc(url(path, canonicalLanguage(path, code)))}$2`)
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1${words.post ? "article" : "website"}$2`)
    .replace(/(<meta\s+(?:property="og:image"|name="twitter:image")\s+content=")[^"]*(")/g, `$1${SITE}${words.post?.cover ?? "/brand/og-image.png"}$2`)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="${esc(localizedPath(path, code))}">${app}</div>`);
  for (const needed of [`<html lang="${tagOf(code)}"`, wordsMeta, "<title>", 'rel="canonical"', "application/ld+json", "data-prerendered"])
    if (!html.includes(needed)) throw new Error(`${path} ${code}: ${needed} missing`);
  return html;
}

const paths = ["/", "/features", "/project", "/download", "/guide", "/blog", ...posts.map((p) => `/blog/${p.slug}`), "/report", "/legal", ...legalDocuments.map((doc) => `/legal/${doc.slug}`)];
let written = 0;
for (const path of paths)
  for (const { code } of LOCALES) {
    const target = localizedPath(path, code);
    const name = target.replace(/^\//, "").replace(/\/$/, "");
    // both /ar/features (as ar/features.html) and /ar/features/ (as its index.html)
    const files = target === "/" ? ["index.html"] : [`${name}.html`, `${name}/index.html`];
    const html = await page(path, code);
    for (const file of files) {
      const out = fileURLToPath(new URL(file, dist));
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html);
    }
    written++;
  }
// an RSS feed per language: /blog/feed.xml, /ar/blog/feed.xml, /de/blog/feed.xml
for (const { code } of LOCALES) {
  const t = labels[code];
  const items = posts
    .map((p) => {
      const text = textOf(p, code);
      const at = url(`/blog/${p.slug}`, code);
      return `    <item>\n      <title>${esc(text.title)}</title>\n      <link>${esc(at)}</link>\n      <guid isPermaLink="true">${esc(at)}</guid>\n      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>\n      <description>${esc(text.summary)}</description>\n${text.tags.map((tag) => `      <category>${esc(tag)}</category>\n`).join("")}    </item>`;
    })
    .join("\n");
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${esc(`${t.blog} — ${t.brand}`)}</title>\n    <link>${esc(url("/blog", code))}</link>\n    <description>${esc(t.blogBody)}</description>\n    <language>${tagOf(code).toLowerCase()}</language>\n    <atom:link href="${esc(SITE + feedPath(code))}" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>\n`;
  const out = fileURLToPath(new URL(feedPath(code).replace(/^\//, ""), dist));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, rss);
}
console.log(`prerendered ${written} pages, ${posts.length} posts, ${LOCALES.length} feeds`);

// Performance gate: each language's words live in its own chunk and nowhere
// else, so a page never downloads the words of the other six languages.
const scripts = readdirSync(new URL("assets/", dist)).filter((name) => name.endsWith(".js"));
for (const { code } of LOCALES) {
  const marker = JSON.stringify(labels[code].heroTitle).slice(1, -1);
  const holders = scripts.filter((name) => readFileSync(new URL(`assets/${name}`, dist), "utf8").includes(marker));
  if (holders.length !== 1 || `/assets/${holders[0]}` !== packChunk[code])
    throw new Error(`the ${code} words must be only in ${packChunk[code]}, found in: ${holders.join(", ") || "no file"}`);
}
console.log(`words split: ${LOCALES.length} languages, one chunk each`);

// the manifest served its purpose here; it is no page of the site, so it
// leaves the deploy output (kept beside the server render in build/)
mkdirSync(new URL("../build/", import.meta.url), { recursive: true });
renameSync(new URL(".vite/manifest.json", dist), new URL("../build/vite-manifest.json", import.meta.url));
rmdirSync(new URL(".vite/", dist));
