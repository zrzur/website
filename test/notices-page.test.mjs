// The third-party notices as a page of the site: language and direction of
// the visitor, the licence texts themselves in English, left to right, and
// wrapped so nothing runs past a 375 px screen.
import assert from "node:assert/strict";
import test from "node:test";

import { noticesPages, renderNoticesPage } from "../scripts/notices-page.mjs";

const page = {
  file: "ar/third-party-notices.html",
  lang: "ar",
  dir: "rtl",
  title: "إشعارات الجهات الخارجية",
  intro: "نصوص التراخيص التالية منشورة بالإنجليزية كما هي.",
  back: "الرئيسية",
  backHref: "/ar/",
  plain: "ملف نصي",
  brand: "زرزور",
};

test("the page carries the visitor's language and direction", () => {
  const html = renderNoticesPage(page, "x <y> & z\n");
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<title>إشعارات الجهات الخارجية — زرزور<\/title>/);
  assert.match(html, /<h1>إشعارات الجهات الخارجية<\/h1>/);
  assert.match(html, /href="\/ar\/"/);
  assert.match(html, /href="\/THIRD-PARTY-NOTICES\.txt"/);
});

test("the licence texts stay English, left to right, escaped and wrapped", () => {
  const html = renderNoticesPage(page, "x <y> & z\n");
  assert.match(html, /<pre lang="en" dir="ltr">x &lt;y&gt; &amp; z\n<\/pre>/);
  assert.match(html, /pre\s*\{[^}]*white-space:\s*pre-wrap/);
  assert.match(html, /pre\s*\{[^}]*overflow-wrap:\s*anywhere/);
  // no script: the page needs none, and the policy allows none inline
  assert.doesNotMatch(html, /<script/);
});

test("one page per language, English at the root", () => {
  const labels = {
    en: { thirdParty: "Third-party notices", thirdPartyIntro: "i", thirdPartyPlain: "p", home: "Home", brand: "Zrzur" },
    ar: { thirdParty: "ع", thirdPartyIntro: "i", thirdPartyPlain: "p", home: "ر", brand: "زرزور" },
  };
  const pages = noticesPages(
    [
      { code: "en", tag: "en", dir: "ltr" },
      { code: "ar", tag: "ar", dir: "rtl" },
    ],
    (code) => labels[code],
  );
  assert.deepEqual(
    pages.map((p) => [p.file, p.lang, p.dir, p.backHref]),
    [
      ["third-party-notices.html", "en", "ltr", "/"],
      ["ar/third-party-notices.html", "ar", "rtl", "/ar/"],
    ],
  );
});
