import test from "node:test";
import assert from "node:assert/strict";

import { readFileSync, readdirSync } from "node:fs";

import { LOCALES, detectLanguage, languageOfTag, localizedPath, splitLocale, tagOf } from "../src/i18n.ts";
import { features } from "../src/content.ts";

const codes = LOCALES.map((locale) => locale.code);
/** every language's words, as the site loads them */
const packs = Object.fromEntries(
  await Promise.all(codes.map(async (code) => [code, (await import(`../src/locales/${code}.ts`)).default])),
);

test("seven languages are listed with native names, tags and direction", () => {
  assert.deepEqual(codes.toSorted(), ["ar", "de", "en", "es", "fr", "ru", "zh"]);
  assert.equal(LOCALES.find((l) => l.code === "ar").dir, "rtl");
  for (const code of ["en", "de", "fr", "es", "ru", "zh"]) assert.equal(LOCALES.find((l) => l.code === code).dir, "ltr", code);
  assert.equal(LOCALES.find((l) => l.code === "de").name, "Deutsch");
  assert.equal(LOCALES.find((l) => l.code === "fr").name, "Français");
  assert.equal(LOCALES.find((l) => l.code === "es").name, "Español");
  assert.equal(LOCALES.find((l) => l.code === "ru").name, "Русский");
  assert.equal(LOCALES.find((l) => l.code === "zh").name, "简体中文");
  assert.equal(tagOf("zh"), "zh-Hans");
  assert.equal(tagOf("fr"), "fr");
});

test("every listed language has every text (no half-translated language)", () => {
  const keys = Object.keys(packs.en.labels).sort();
  for (const code of codes) {
    const pack = packs[code];
    assert.deepEqual(Object.keys(pack.labels).sort(), keys, `labels.${code}`);
    for (const [key, value] of Object.entries(pack.labels)) assert(value.trim(), `labels.${code}.${key} is empty`);
    for (const feature of features)
      for (const field of ["title", "body"]) assert(pack.features[feature.id]?.[field]?.trim(), `feature ${feature.id}.${field}.${code}`);
    assert.equal(pack.faqs.length, packs.en.faqs.length, `faqs ${code}`);
    for (const faq of pack.faqs) {
      assert(faq.question.trim(), `faq question ${code}`);
      assert(faq.answer.trim(), `faq answer ${code}`);
    }
  }
});

test("a new language is translated, not English left in place", () => {
  // words that stay the same in every language: names, units, codes
  const same = new Set(["brand", "flockName", "copyright", "demoPeople1", "demoPeople3", "dlSize", "blog", "menu", "documents", "questions", "rolesP2", "why2", "rolesP1", "legalLinkContact", "demoChat", "demoChatCategory", "demoInfo", "demoLobby", "help", "rolesP3", "dlVersion", "footerLegal"]);
  for (const code of ["fr", "es", "ru", "zh"]) {
    const copied = Object.entries(packs[code].labels).filter(([key, value]) => !same.has(key) && value === packs.en.labels[key]);
    assert.deepEqual(copied.map(([key]) => key), [], `${code}: still in English`);
  }
});

test("placeholders survive translation", () => {
  for (const code of codes)
    for (const [key, value] of Object.entries(packs.en.labels))
      for (const holder of value.match(/\{[a-z]+\}/g) ?? [])
        assert(packs[code].labels[key].includes(holder), `${code}.${key} keeps ${holder}`);
});

test("Russian and Chinese use the glossary words for the shared terms", () => {
  assert.equal(packs.ru.labels.discover, "Обзор");
  assert.equal(packs.zh.labels.discover, "发现");
  assert.equal(packs.fr.labels.discover, "Découvrir");
  assert.equal(packs.es.labels.discover, "Descubrir");
  assert.match(packs.fr.labels.seoHomeBody, /serveurs/);
  assert.match(packs.es.labels.seoHomeBody, /servidores/);
  assert.match(packs.ru.labels.seoHomeBody, /серверы/);
  assert.match(packs.zh.labels.seoHomeBody, /服务器/);
  // the product name is never translated or transliterated
  for (const code of ["fr", "es", "ru", "zh"]) assert.equal(packs[code].labels.brand, "Zrzur");
});

test("French puts a no-break space before : ; ? !", () => {
  for (const file of ["../src/locales/fr.ts", "../src/report-text/fr.ts"]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    const strings = [...source.matchAll(/"([^"\n]*)"|`([^`]*)`/g)].map((m) => m[1] ?? m[2]);
    for (const text of strings) assert.doesNotMatch(text, / [:;?!]/, `${file}: ${text}`);
  }
});

test("other languages live under their prefix, English at the root", () => {
  assert.deepEqual(splitLocale("/de/download"), { language: "de", path: "/download" });
  assert.deepEqual(splitLocale("/ar/"), { language: "ar", path: "/" });
  assert.deepEqual(splitLocale("/ar"), { language: "ar", path: "/" });
  assert.deepEqual(splitLocale("/fr/download"), { language: "fr", path: "/download" });
  assert.deepEqual(splitLocale("/zh/legal/privacy"), { language: "zh", path: "/legal/privacy" });
  assert.deepEqual(splitLocale("/download"), { language: null, path: "/download" });
  // English has no prefix; unknown codes are ordinary paths
  assert.deepEqual(splitLocale("/en/download"), { language: null, path: "/en/download" });
  assert.deepEqual(splitLocale("/it/download"), { language: null, path: "/it/download" });
  assert.equal(localizedPath("/download", "de"), "/de/download");
  assert.equal(localizedPath("/", "ar"), "/ar/");
  assert.equal(localizedPath("/", "ru"), "/ru/");
  assert.equal(localizedPath("/legal/privacy", "en"), "/legal/privacy");
});

test("the sitemap lists every page in every language with its alternates", async () => {
  const { readFile } = await import("node:fs/promises");
  const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const page of ["/", "/features", "/download", "/legal/privacy"]) {
    assert(locs.includes(`https://zrzur.com${page}`), page);
    for (const code of ["de", "ar", "fr", "es", "ru", "zh"])
      assert(locs.includes(`https://zrzur.com/${code}${page === "/" ? "" : page}`), `${code} ${page}`);
  }
  assert.match(xml, /hreflang="x-default"/);
  assert.match(xml, /hreflang="ar" href="https:\/\/zrzur\.com\/ar\/download"/);
  assert.match(xml, /hreflang="zh-Hans" href="https:\/\/zrzur\.com\/zh\/download"/);
  assert.doesNotMatch(xml, /hreflang="zh"/);
});

test("the URL decides first, then the saved choice, then the browser, then English", () => {
  assert.equal(detectLanguage("/de/", "ar", ["en-US"]), "de");
  assert.equal(detectLanguage("/", "ar", ["de-DE"]), "ar");
  assert.equal(detectLanguage("/", null, ["de-AT", "en"]), "de");
  assert.equal(detectLanguage("/", "xx", ["it-IT", "ar-SY"]), "ar");
  assert.equal(detectLanguage("/", null, ["it-IT"]), "en");
  assert.equal(detectLanguage("/", null, ["fr-CA"]), "fr");
  assert.equal(detectLanguage("/", null, ["es-MX"]), "es");
  assert.equal(detectLanguage("/", null, ["ru"]), "ru");
  assert.equal(detectLanguage("/", "fr", ["ru"]), "fr");
  assert.equal(detectLanguage("/ru/features", "fr", ["zh-CN"]), "ru");
});

test("Chinese is offered only to simplified-script browsers", () => {
  for (const tag of ["zh", "zh-CN", "zh-SG", "zh-Hans", "zh-Hans-CN", "zh_CN"]) assert.equal(languageOfTag(tag), "zh", tag);
  for (const tag of ["zh-TW", "zh-HK", "zh-MO", "zh-Hant", "zh-Hant-TW"]) assert.equal(languageOfTag(tag), null, tag);
  // a traditional-script reader falls through to their next language
  assert.equal(detectLanguage("/", null, ["zh-TW", "en-US"]), "en");
  assert.equal(detectLanguage("/", null, ["zh-HK", "de"]), "de");
});

test("the first-paint script knows every language prefix", () => {
  const theme = readFileSync(new URL("../public/theme.js", import.meta.url), "utf8");
  const prefixes = theme.match(/\^\\\/\(([a-z|]+)\)/)[1].split("|").toSorted();
  assert.deepEqual(prefixes, codes.filter((code) => code !== "en").toSorted());
  assert.match(theme, /"zh-Hans"/);
});

test("Arabic text says سيرفر, never خادم or خوادم", () => {
  const root = new URL("../src/", import.meta.url);
  const files = [
    ...readdirSync(root).filter((f) => f.endsWith(".ts")),
    ...readdirSync(new URL("policies/", root)).map((f) => `policies/${f}`),
    "locales/ar.ts",
    "report-text/ar.ts",
  ];
  assert(files.length > 10);
  for (const file of files)
    assert.doesNotMatch(readFileSync(new URL(file, root), "utf8"), /خادم|خوادم/, file);
});
