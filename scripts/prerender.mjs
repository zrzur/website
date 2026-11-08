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
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { faqs, labels } from "../src/content.ts";
import { readPosts } from "./blog-files.mjs";
import { plain } from "../src/blog-md.ts";

const posts = readPosts();
import { LOCALES, localizedPath } from "../src/i18n.ts";
import { canonicalUrl } from "../src/config.ts";

const dist = new URL("../dist/", import.meta.url);
const shell = readFileSync(new URL("index.html", dist), "utf8");
const SITE = "https://zrzur.com";
const OG_LOCALE = { en: "en_US", de: "de_DE", ar: "ar_AR" };

const esc = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (path, code) => canonicalUrl(localizedPath(path, code));
const feedPath = (code) => `${code === "en" ? "" : `/${code}`}/blog/feed.xml`;
/** a post's blocks as plain HTML for readers without the app */
const inlineHtml = (parts) =>
  parts
    .map((part) =>
      part.kind === "strong" ? `<strong>${esc(part.text)}</strong>`
      : part.kind === "em" ? `<em>${esc(part.text)}</em>`
      : part.kind === "code" ? `<code>${esc(part.text)}</code>`
      : part.kind === "link" ? `<a href="${esc(part.href)}">${esc(part.text)}</a>`
      : esc(part.text),
    )
    .join("");
const blocksHtml = (blocks) =>
  blocks
    .map((b) =>
      b.kind === "h2" || b.kind === "h3" ? `<${b.kind} id="${esc(b.id)}">${esc(b.text)}</${b.kind}>`
      : b.kind === "p" ? `<p>${inlineHtml(b.parts)}</p>`
      : b.kind === "quote" ? `<blockquote>${inlineHtml(b.parts)}</blockquote>`
      : b.kind === "ul" || b.kind === "ol" ? `<${b.kind}>${b.items.map((i) => `<li>${inlineHtml(i)}</li>`).join("")}</${b.kind}>`
      : b.kind === "code" ? `<pre><code>${esc(b.text)}</code></pre>`
      : `<img src="${esc(b.src)}" alt="${esc(b.alt)}" />`,
    )
    .join("");
void plain;
const link = (path, code, text) => `<a href="${esc(localizedPath(path, code))}">${esc(text)}</a>`;

/** what each page says first, in the language of the page */
function pageWords(path, code) {
  const t = labels[code];
  const post = path.startsWith("/blog/") ? posts.find((entry) => `/blog/${entry.slug}` === path) : null;
  if (path === "/")
    return {
      title: t.seoHomeTitle,
      description: t.seoHomeBody,
      body: [
        `<h1>${esc(t.heroTitle)}</h1>`,
        `<p>${esc(t.heroBody)}</p>`,
        `<h2>${esc(t.serversTitle)}</h2><p>${esc(t.serversBody)}</p>`,
        `<h2>${esc(t.voiceTitle)}</h2><p>${esc(t.voiceBody)}</p>`,
        `<h2>${esc(t.whyTitle)}</h2><ul>${[1, 2, 3, 4].map((n) => `<li><strong>${esc(t[`why${n}`])}</strong> ${esc(t[`why${n}Body`])}</li>`).join("")}</ul>`,
      ],
    };
  if (path === "/features") return { title: `${t.features} — ${t.brand}`, description: t.featuresBody, body: [`<h1>${esc(t.featuresTitle.replace("\n", " "))}</h1>`, `<p>${esc(t.featuresBody)}</p>`] };
  if (path === "/project") return { title: `${t.project} — ${t.brand}`, description: t.projectBody, body: [`<h1>${esc(t.projectTitle)}</h1>`, `<p>${esc(t.projectBody)}</p>`, `<p>${esc(t.projectP1)}</p>`, `<p>${esc(t.projectP3)}</p>`] };
  if (path === "/download") return { title: `${t.downloadTitle} — ${t.brand}`, description: t.downloadBody, body: [`<h1>${esc(t.downloadTitle)}</h1>`, `<p>${esc(t.downloadBody)}</p>`] };
  if (path === "/guide")
    return {
      title: `${t.help} — ${t.brand}`,
      description: t.helpBody,
      body: [`<h1>${esc(t.helpTitle.replace("\n", " "))}</h1>`, `<p>${esc(t.helpBody)}</p>`, `<h2>${esc(t.faqTitle)}</h2>`, ...faqs.map((f) => `<h3>${esc(f.question[code])}</h3><p>${esc(f.answer[code])}</p>`)],
    };
  if (path === "/blog")
    return {
      title: `${t.blog} — ${t.brand}`,
      description: t.blogBody,
      body: [`<h1>${esc(t.blogTitle)}</h1>`, `<p>${esc(t.blogBody)}</p>`, ...posts.map((p) => `<article><h2>${link(`/blog/${p.slug}`, code, p.text[code].title)}</h2><p>${esc(p.text[code].summary)}</p></article>`)],
    };
  if (post)
    return {
      title: `${post.text[code].title} — ${t.brand}`,
      description: post.text[code].summary,
      body: [`<article><h1>${esc(post.text[code].title)}</h1><time datetime="${post.date}">${post.date}</time><p>${esc(post.text[code].summary)}</p>${blocksHtml(post.text[code].blocks)}</article>`],
      post,
    };
  throw new Error(`no words for ${path}`);
}

/** structured data: who we are, what the app is, and what the page holds */
function structured(path, code, words) {
  const t = labels[code];
  const org = { "@type": "Organization", "@id": `${SITE}/#org`, name: "Zrzur", alternateName: "زرزور", url: SITE, logo: `${SITE}/brand/icon-512.png`, sameAs: ["https://github.com/zrzur"] };
  const graph = [org, { "@type": "WebSite", "@id": `${SITE}/#site`, name: "Zrzur", alternateName: "زرزور", url: SITE, inLanguage: LOCALES.map((l) => l.code), publisher: { "@id": `${SITE}/#org` } }];
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
      inLanguage: code,
      isAccessibleForFree: true,
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: { "@id": `${SITE}/#org` },
    });
  if (path === "/guide")
    graph.push({ "@type": "FAQPage", inLanguage: code, mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question[code], acceptedAnswer: { "@type": "Answer", text: f.answer[code] } })) });
  if (words.post)
    graph.push({
      "@type": "BlogPosting",
      headline: words.post.text[code].title,
      description: words.post.text[code].summary,
      datePublished: words.post.date,
      dateModified: words.post.date,
      wordCount: words.post.text[code].words,
      keywords: words.post.text[code].tags.join(", "),
      inLanguage: code,
      mainEntityOfPage: url(path, code),
      author: { "@id": `${SITE}/#org` },
      publisher: { "@id": `${SITE}/#org` },
      image: `${SITE}${words.post.cover ?? "/brand/og-image.png"}`,
    });
  // the JSON may not close the script element early
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

function page(path, code) {
  const words = pageWords(path, code);
  const dir = LOCALES.find((l) => l.code === code).dir;
  const head = [
    `<link rel="canonical" href="${esc(url(path, code))}" />`,
    ...LOCALES.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${esc(url(path, l.code))}" />`),
    `<link rel="alternate" hreflang="x-default" href="${esc(url(path, "en"))}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[code]}" />`,
    ...LOCALES.filter((l) => l.code !== code).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l.code]}" />`),
    `<meta name="twitter:title" content="${esc(words.title)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${esc(`${labels[code].blog} — ${labels[code].brand}`)}" href="${esc(feedPath(code))}" />`,
    ...(words.post ? [`<meta property="article:published_time" content="${words.post.date}" />`, ...words.post.text[code].tags.map((tag) => `<meta property="article:tag" content="${esc(tag)}" />`)] : []),
    `<meta name="twitter:description" content="${esc(words.description)}" />`,
    `<script type="application/ld+json">${structured(path, code, words)}</script>`,
  ].join("\n    ");
  const t = labels[code];
  const nav = [["/", t.home], ["/features", t.features], ["/project", t.project], ["/guide", t.help], ["/download", t.navDownload], ["/blog", t.blog]]
    .map(([p, text]) => link(p, code, text))
    .join(" ");
  let html = shell
    .replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${code}" dir="${dir}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(words.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(words.description)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(words.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(words.description)}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${esc(url(path, code))}$2`)
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1${words.post ? "article" : "website"}$2`)
    .replace(/(<meta\s+(?:property="og:image"|name="twitter:image")\s+content=")[^"]*(")/g, `$1${SITE}${words.post?.cover ?? "/brand/og-image.png"}$2`)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered=""><header><nav>${nav}</nav></header><main>${words.body.join("")}</main></div>`);
  for (const needed of [`<html lang="${code}"`, "<title>", 'rel="canonical"', "application/ld+json", "data-prerendered"])
    if (!html.includes(needed)) throw new Error(`${path} ${code}: ${needed} missing`);
  return html;
}

const paths = ["/", "/features", "/project", "/download", "/guide", "/blog", ...posts.map((p) => `/blog/${p.slug}`)];
let written = 0;
for (const path of paths)
  for (const { code } of LOCALES) {
    const target = localizedPath(path, code);
    const name = target.replace(/^\//, "").replace(/\/$/, "");
    // both /ar/features (as ar/features.html) and /ar/features/ (as its index.html)
    const files = target === "/" ? ["index.html"] : [`${name}.html`, `${name}/index.html`];
    const html = page(path, code);
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
      const text = p.text[code];
      const at = url(`/blog/${p.slug}`, code);
      return `    <item>\n      <title>${esc(text.title)}</title>\n      <link>${esc(at)}</link>\n      <guid isPermaLink="true">${esc(at)}</guid>\n      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>\n      <description>${esc(text.summary)}</description>\n${text.tags.map((tag) => `      <category>${esc(tag)}</category>\n`).join("")}    </item>`;
    })
    .join("\n");
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${esc(`${t.blog} — ${t.brand}`)}</title>\n    <link>${esc(url("/blog", code))}</link>\n    <description>${esc(t.blogBody)}</description>\n    <language>${code}</language>\n    <atom:link href="${esc(SITE + feedPath(code))}" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>\n`;
  const out = fileURLToPath(new URL(feedPath(code).replace(/^\//, ""), dist));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, rss);
}
console.log(`prerendered ${written} pages, ${posts.length} posts, ${LOCALES.length} feeds`);
