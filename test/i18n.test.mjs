import test from "node:test";
import assert from "node:assert/strict";

import { readFileSync, readdirSync } from "node:fs";

import { LOCALES, detectLanguage, localizedPath, splitLocale } from "../src/i18n.ts";
import { faqs, features, labels } from "../src/content.ts";

const codes = LOCALES.map((locale) => locale.code);

test("English, German and Arabic are listed with native names and direction", () => {
  assert.deepEqual(codes.toSorted(), ["ar", "de", "en"]);
  assert.equal(LOCALES.find((l) => l.code === "ar").dir, "rtl");
  assert.equal(LOCALES.find((l) => l.code === "de").name, "Deutsch");
});

test("every listed language has every text (no half-translated language)", () => {
  const keys = Object.keys(labels.en).sort();
  for (const code of codes) {
    assert.deepEqual(Object.keys(labels[code]).sort(), keys, `labels.${code}`);
    for (const [key, value] of Object.entries(labels[code]))
      assert(value.trim(), `labels.${code}.${key} is empty`);
    for (const feature of features)
      for (const field of ["title", "body", "detail"])
        assert(feature[field][code]?.trim(), `feature ${feature.id}.${field}.${code}`);
    for (const faq of faqs) {
      assert(faq.question[code]?.trim(), `faq question ${code}`);
      assert(faq.answer[code]?.trim(), `faq answer ${code}`);
    }
  }
});

test("German and Arabic pages live under their prefix, English at the root", () => {
  assert.deepEqual(splitLocale("/de/download"), { language: "de", path: "/download" });
  assert.deepEqual(splitLocale("/ar/"), { language: "ar", path: "/" });
  assert.deepEqual(splitLocale("/ar"), { language: "ar", path: "/" });
  assert.deepEqual(splitLocale("/download"), { language: null, path: "/download" });
  // English has no prefix; unknown codes are ordinary paths
  assert.deepEqual(splitLocale("/en/download"), { language: null, path: "/en/download" });
  assert.deepEqual(splitLocale("/fr/download"), { language: null, path: "/fr/download" });
  assert.equal(localizedPath("/download", "de"), "/de/download");
  assert.equal(localizedPath("/", "ar"), "/ar/");
  assert.equal(localizedPath("/legal/privacy", "en"), "/legal/privacy");
});

test("the sitemap lists every page in every language with its alternates", async () => {
  const { readFile } = await import("node:fs/promises");
  const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const page of ["/", "/features", "/download", "/legal/privacy"]) {
    const en = `https://zrzur.com${page}`;
    assert(locs.includes(en), en);
    assert(locs.includes(`https://zrzur.com/de${page === "/" ? "" : page}`), `de ${page}`);
    assert(locs.includes(`https://zrzur.com/ar${page === "/" ? "" : page}`), `ar ${page}`);
  }
  assert.match(xml, /hreflang="x-default"/);
  assert.match(xml, /hreflang="ar" href="https:\/\/zrzur\.com\/ar\/download"/);
});

test("the URL decides first, then the saved choice, then the browser", () => {
  assert.equal(detectLanguage("/de/", "ar", ["en-US"]), "de");
  assert.equal(detectLanguage("/", "ar", ["de-DE"]), "ar");
  assert.equal(detectLanguage("/", null, ["de-AT", "en"]), "de");
  assert.equal(detectLanguage("/", "xx", ["fr-FR", "ar-SY"]), "ar");
  assert.equal(detectLanguage("/", null, ["fr-FR"]), "en");
});

test("Arabic text says سيرفر, never خادم or خوادم", () => {
  const root = new URL("../src/", import.meta.url);
  const files = [
    ...readdirSync(root).filter((f) => f.endsWith(".ts")),
    ...readdirSync(new URL("policies/", root)).map((f) => `policies/${f}`),
  ];
  assert(files.length > 10);
  for (const file of files)
    assert.doesNotMatch(readFileSync(new URL(file, root), "utf8"), /خادم|خوادم/, file);
});
