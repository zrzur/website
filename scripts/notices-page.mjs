// The third-party notices as a page of the site, in the visitor's language
// (/third-party-notices, /ar/third-party-notices, ...). The licence texts
// themselves stay as published: English, left to right, in a wrapped block.
// The plain THIRD-PARTY-NOTICES.txt stays next to them for tools.
// Plain Node, no dependencies; the site serves {path}.html for {path}.

/** The file the shared notices plugin (third-party-notices.mjs) emits */
const NOTICES_TEXT = "THIRD-PARTY-NOTICES.txt";

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * One language's page.
 * @param {{ lang: string, dir: string, title: string, intro: string, back: string,
 *   backHref: string, plain: string, brand: string }} page
 * @param {string} text the notices
 */
export function renderNoticesPage(page, text) {
  return `<!doctype html>
<html lang="${escape(page.lang)}" dir="${escape(page.dir)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="robots" content="noindex" />
<title>${escape(page.title)} — ${escape(page.brand)}</title>
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
pre { margin: 0; padding: 16px; border: 1px solid #303348; border-radius: 10px; background: #171925;
  font: 13px/1.6 "IBM Plex Mono", ui-monospace, monospace; white-space: pre-wrap; overflow-wrap: anywhere; text-align: left; }
</style>
</head>
<body>
<main>
<nav><a href="${escape(page.backHref)}">${escape(page.back)}</a><a href="/${NOTICES_TEXT}" lang="en" dir="ltr" hreflang="en">${escape(page.plain)}</a></nav>
<h1>${escape(page.title)}</h1>
<p>${escape(page.intro)}</p>
<pre lang="en" dir="ltr">${escape(text)}</pre>
</main>
</body>
</html>
`;
}

/**
 * One page per site language; English at the root, the others under /<code>/
 * @param {readonly { code: string, tag: string, dir: string }[]} locales
 * @param {(code: string) => { thirdParty: string, thirdPartyIntro: string,
 *   thirdPartyPlain: string, home: string, brand: string }} labelsOf
 */
export function noticesPages(locales, labelsOf) {
  return locales.map(({ code, tag, dir }) => {
    const l = labelsOf(code);
    return {
      file: code === "en" ? "third-party-notices.html" : `${code}/third-party-notices.html`,
      lang: tag,
      dir,
      title: l.thirdParty,
      intro: l.thirdPartyIntro,
      back: l.home,
      backHref: code === "en" ? "/" : `/${code}/`,
      plain: l.thirdPartyPlain,
      brand: l.brand,
    };
  });
}

/**
 * Vite/Rollup plugin, after the shared notices plugin: reads the text it
 * emitted and writes the pages.
 * @param {ReturnType<typeof noticesPages>} pages
 */
export function noticesPagesPlugin(pages) {
  return {
    name: "zrzur-notices-pages",
    apply: "build",
    generateBundle(_options, bundle) {
      const asset = bundle[NOTICES_TEXT];
      if (!asset || asset.type !== "asset") {
        this.error(`notices pages: ${NOTICES_TEXT} was not emitted (the notices plugin must come first)`);
        return;
      }
      const text = typeof asset.source === "string" ? asset.source : new TextDecoder().decode(asset.source);
      for (const page of pages) {
        this.emitFile({ type: "asset", fileName: page.file, source: renderNoticesPage(page, text) });
      }
    },
  };
}
