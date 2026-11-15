// The /source page (AGPL section 13): for each running part of Zrzur, its
// version, the commit it was built from, a link to that exact source and a
// download of it. One page per site language (/source, /ar/source, ...).
// The website row comes from this build; the other rows from the release
// manifest (src/releases.ts). The web app and server rows are read again in
// the visitor's browser from the running services (/source.js, from
// scripts/source-runtime.mjs), so a deploy after the website build still shows
// its own commit; without JavaScript the page says its rows may be older.
// Plain Node; the site serves {path}.html for {path}.
import { readFileSync } from "node:fs";

const ORG = "https://github.com/zrzur";

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The rows of the table, website first.
 * @param {{ version: string, commit: string }} website this build
 * @param {Record<string, { repo: string, version: string, commit: string, live?: { url: string, versionKey: string } }>} releases
 * @returns {{ key: string, repo: string, version: string, commit: string, live?: { url: string, versionKey: string } }[]}
 */
export function sourceRows(website, releases) {
  const rows = [
    { key: "sourceWebsite", repo: "website", version: website.version, commit: website.commit },
    { key: "sourceWebApp", repo: releases.web.repo, version: releases.web.version, commit: releases.web.commit, live: releases.web.live },
    { key: "sourceServer", repo: releases.backend.repo, version: releases.backend.version, commit: releases.backend.commit, live: releases.backend.live },
    { key: "sourceDesktop", repo: releases.desktop.repo, version: releases.desktop.version, commit: releases.desktop.commit },
  ];
  for (const row of rows)
    if (!/^[0-9a-f]{40}$/.test(row.commit))
      throw new Error(`source page: ${row.repo} has no full commit (got "${row.commit}"); a source link must name the exact commit`);
  return rows;
}

/**
 * One language's page.
 * @param {{ lang: string, dir: string, labels: Record<string, string>, backHref: string }} page
 * @param {ReturnType<typeof sourceRows>} rows
 */
export function renderSourcePage(page, rows) {
  const l = page.labels;
  const body = rows
    .map((row) => {
      const tree = `${ORG}/${row.repo}/tree/${row.commit}`;
      const archive = `${ORG}/${row.repo}/archive/${row.commit}.tar.gz`;
      const live = row.live
        ? ` data-live="${escape(row.live.url)}" data-version-key="${escape(row.live.versionKey)}" data-repo="${escape(row.repo)}" data-state="build"`
        : "";
      return `<tr${live}>
<th scope="row">${escape(l[row.key])}</th>
<td dir="ltr" data-cell="version">${escape(row.version)}</td>
<td dir="ltr"><code data-cell="commit" title="${escape(row.commit)}">${escape(row.commit.slice(0, 12))}</code></td>
<td><a href="${escape(tree)}" rel="noopener" data-link="tree">${escape(l.sourceBrowse)}</a> <a href="${escape(archive)}" rel="noopener" data-link="archive">${escape(l.sourceArchive)}</a></td>
</tr>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="${escape(page.lang)}" dir="${escape(page.dir)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="robots" content="noindex" />
<title>${escape(l.source)} — ${escape(l.brand)}</title>
<script type="module" src="/source.js"></script>
<style>
@font-face { font-family: "IBM Plex Sans"; src: url("/assets/plex-latin-wght.woff2") format("woff2-variations"); font-weight: 100 700; font-display: swap; }
@font-face { font-family: "IBM Plex Sans Arabic"; src: url("/assets/plex-arabic-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "IBM Plex Sans Arabic"; src: url("/assets/plex-arabic-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
* { box-sizing: border-box; }
html { background: #0D0E16; color: #F0F1F8; }
body { margin: 0; font: 16px/1.6 "IBM Plex Sans", "IBM Plex Sans Arabic", system-ui, sans-serif; }
:lang(ar) body { font-family: "IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif; line-height: 1.7; }
main { max-width: 920px; margin: 0 auto; padding: 32px 16px 64px; }
nav { display: flex; flex-wrap: wrap; gap: 0 24px; margin-block-end: 24px; }
a { display: inline-flex; align-items: center; min-height: 44px; min-width: 44px; color: #FF7AA8; }
a:focus-visible { outline: 2px solid #E0195F; outline-offset: 2px; border-radius: 4px; }
h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.3; color: #F7F8FC; }
p { margin: 0 0 24px; color: #A1A5B8; }
.table { overflow-x: auto; border: 1px solid #303348; border-radius: 10px; background: #171925; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px 16px; text-align: start; vertical-align: middle; border-block-end: 1px solid #303348; }
tr:last-child th, tr:last-child td { border-block-end: 0; }
thead th { font-size: 14px; font-weight: 600; color: #A1A5B8; }
td a + a { margin-inline-start: 16px; }
code { font: 14px/1.6 "IBM Plex Mono", ui-monospace, monospace; }
.status { margin: 16px 0 0; font-size: 14px; }
</style>
</head>
<body>
<main>
<nav><a href="${escape(page.backHref)}">${escape(l.home)}</a><a href="${ORG}" rel="noopener">${escape(l.sourceAll)}</a></nav>
<h1>${escape(l.source)}</h1>
<p>${escape(l.sourceIntro)}</p>
<div class="table">
<table>
<thead><tr><th scope="col">${escape(l.sourcePart)}</th><th scope="col">${escape(l.sourceVersion)}</th><th scope="col">${escape(l.sourceCommit)}</th><th scope="col">${escape(l.source)}</th></tr></thead>
<tbody>
${body}
</tbody>
</table>
</div>
<p class="status" id="source-status" role="status" data-state="fallback" data-live="${escape(l.sourceLive)}" data-partial="${escape(l.sourcePartial)}">${escape(l.sourceFallback)}</p>
</main>
</body>
</html>
`;
}

/**
 * One page per site language; English at the root, the others under /<code>/
 * @param {readonly { code: string, tag: string, dir: string }[]} locales
 * @param {(code: string) => Record<string, string>} labelsOf
 */
export function sourcePages(locales, labelsOf) {
  return locales.map(({ code, tag, dir }) => ({
    file: code === "en" ? "source.html" : `${code}/source.html`,
    lang: tag,
    dir,
    labels: labelsOf(code),
    backHref: code === "en" ? "/" : `/${code}`,
  }));
}

/**
 * Vite/Rollup plugin: writes the pages into the build.
 * @param {ReturnType<typeof sourcePages>} pages
 * @param {() => ReturnType<typeof sourceRows>} rowsOf called at build time
 *   only, so a dev server without a git commit still starts
 */
export function sourcePagesPlugin(pages, rowsOf) {
  return {
    name: "zrzur-source-pages",
    apply: "build",
    generateBundle() {
      const rows = rowsOf();
      for (const page of pages) this.emitFile({ type: "asset", fileName: page.file, source: renderSourcePage(page, rows) });
      // the script that reads the running services, as a file of the site
      this.emitFile({ type: "asset", fileName: "source.js", source: readFileSync(new URL("./source-runtime.mjs", import.meta.url), "utf8") });
    },
  };
}
