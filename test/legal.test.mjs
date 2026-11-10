import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  legalDocuments,
  legalFooterLinks,
  legalGroups,
  policyVersions,
} from "../src/legal.ts";
import { CREATOR_TERMS_VERSION } from "../src/policies/creator-terms.ts";
import { bindingLanguages, bindingNotice, hasLanguage, shownLanguage } from "../src/legal-binding.ts";
import { LOCALES } from "../src/i18n.ts";
import en from "../src/locales/en.ts";

const EXPECTED_SLUGS = [
  "terms",
  "privacy",
  "community-guidelines",
  "enforcement-appeals",
  "paid-services",
  "server-owner-rules",
  "discover-guidelines",
  "developer-terms",
  "plugin-policy",
  "creator-terms",
  "imprint",
  "contact",
];
const BANNER = {
  en: "Draft — to be reviewed by a lawyer before it takes effect.",
  de: "Entwurf – wird vor Inkrafttreten anwaltlich geprüft.",
  ar: "مسودة — تحتاج مراجعة محامٍ قبل اعتمادها.",
};

test("every expected policy exists exactly once", () => {
  const slugs = legalDocuments.map((doc) => doc.slug);
  assert.deepEqual([...slugs].sort(), [...EXPECTED_SLUGS].sort());
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every policy has Arabic and English title, intro and sections", () => {
  for (const doc of legalDocuments) {
    for (const lang of ["ar", "en"]) {
      assert(doc.title[lang]?.trim(), `${doc.slug} title.${lang}`);
      assert(doc.intro[lang]?.trim(), `${doc.slug} intro.${lang}`);
      assert(doc.lastUpdated[lang]?.trim(), `${doc.slug} lastUpdated.${lang}`);
    }
    assert(doc.sections.length > 0, `${doc.slug} has sections`);
    const ids = doc.sections.map((section) => section.id);
    assert.equal(new Set(ids).size, ids.length, `${doc.slug} unique ids`);
    for (const section of doc.sections)
      for (const lang of ["ar", "en"]) {
        assert(section.title[lang]?.trim(), `${doc.slug}#${section.id}`);
        assert(section.body[lang]?.trim(), `${doc.slug}#${section.id}`);
      }
  }
});

test("every policy carries the draft banner and the current date", () => {
  for (const doc of legalDocuments) {
    assert.deepEqual(doc.banner, BANNER, doc.slug);
    const date = doc.slug === "creator-terms" || REVISED.includes(doc.slug) ? "7" : "4";
    assert.equal(doc.lastUpdated.en, `Last updated: ${date} November 2026`);
    assert.deepEqual(doc.sources, []);
  }
});

test("Arabic text is written in Arabic, not copied English", () => {
  for (const doc of legalDocuments)
    for (const section of doc.sections) {
      if (doc.slug === "imprint") continue;
      assert(/[\u0600-\u06FF]/.test(section.body.ar), `${doc.slug}#${section.id}`);
      assert.notEqual(section.body.ar, section.body.en);
    }
});

test("no links to Stoat, Revolt or Discord legal pages or hosts", () => {
  const text = JSON.stringify(legalDocuments).toLowerCase();
  for (const host of [
    "stoat.chat",
    "revolt.chat",
    "discord.com",
    "discord.gg",
    "stoatusercontent.com",
    "revoltusercontent.com",
  ])
    assert(!text.includes(host), host);
  for (const url of text.match(/https?:\/\/[^\s"\\)]+/g) ?? [])
    assert(/^https:\/\/(github\.com\/zrzur|([a-z0-9-]+\.)?zrzur\.(com|cc))/.test(url), url);
});

test("product names are used exactly", () => {
  const text = JSON.stringify(legalDocuments);
  for (const wrong of ["Zarzur", "Zarzoor", "ZARZOUR", "Zarzour", "Zarzour Plus", "Starling", "Toast"])
    assert(!text.includes(wrong), wrong);
  for (const name of ["Feather", "Wings", "Promoted", "Spotlight", "Headline", "Top row"])
    assert(text.includes(name), name);
  for (const name of ["ريشة", "أجنحة", "سيرفر", "زرزور"])
    assert(text.includes(name), name);
});

const REVISED = ["privacy", "enforcement-appeals", "paid-services"];

test("policyVersions covers every slug with the policy date", () => {
  assert.deepEqual(Object.keys(policyVersions).sort(), [...EXPECTED_SLUGS].sort());
  for (const slug of EXPECTED_SLUGS) {
    const version = slug === "creator-terms" ? CREATOR_TERMS_VERSION
      : REVISED.includes(slug) ? "2026-11-07" : "2026-11-04";
    assert.equal(policyVersions[slug], version);
  }
});

test("changed policies show the date of their version", () => {
  for (const slug of REVISED) {
    const doc = legalDocuments.find((item) => item.slug === slug);
    assert(doc.lastUpdated.en.includes("7 November 2026"), slug);
    assert(doc.lastUpdated.ar.includes("٧ نوفمبر"), slug);
    assert(doc.lastUpdated.de.includes("7. November 2026"), slug);
  }
  const terms = legalDocuments.find((item) => item.slug === "terms");
  assert(terms.lastUpdated.en.includes("4 November 2026"));
});

const policy = (slug) => legalDocuments.find((doc) => doc.slug === slug);
const body = (slug, id, lang) => policy(slug).sections.find((s) => s.id === id).body[lang];
const all = (slug, lang) => policy(slug).sections.map((s) => s.body[lang]).join("\n");

test("the Creator Terms say what the code does", () => {
  assert.equal(CREATOR_TERMS_VERSION, "2026-11-07");
  for (const lang of ["en", "ar"]) {
    assert(!all("creator-terms", lang).includes(lang === "en" ? "aged 13" : "١٣"), lang);
    assert(!all("creator-terms", lang).includes("[7]"), lang);
    for (const id of ["animated", "repeat", "public"])
      assert(body("creator-terms", id, lang)?.trim(), `${id} ${lang}`);
    assert(body("creator-terms", "animated", lang).includes("WebM"), lang);
  }
  assert(!all("creator-terms", "en").includes("Every item is reviewed before it is published"));
  assert(body("creator-terms", "content", "en").includes("aged 16 and 17"));
  assert(body("creator-terms", "content", "ar").includes("١٦"));
  assert(body("creator-terms", "review", "en").includes("automatic checks"));
  assert(body("creator-terms", "review", "en").includes("a reviewer must approve"));
  assert(body("creator-terms", "public", "en").includes("Show my name on the public Designs site"));
});

test("the Creator Terms are complete in German and match the English", () => {
  const terms = legalDocuments.find((item) => item.slug === "creator-terms");
  assert(terms.intro.de?.trim());
  for (const { id, title, body } of terms.sections) {
    assert(title.de?.trim(), `title of ${id}`);
    assert(body.de?.trim(), `body of ${id}`);
    assert.notEqual(body.de, body.en, id);
    assert.equal(body.de.split(/\n/).length, body.en.split(/\n/).length, `lines of ${id}`);
    assert.equal((body.de.match(/^- /gm) ?? []).length, (body.en.match(/^- /gm) ?? []).length, `list of ${id}`);
  }
  assert(body("creator-terms", "animated", "de").includes("WebM"));
  assert(body("creator-terms", "content", "de").includes("16 und 17"));
  assert(body("creator-terms", "review", "de").includes("automatischen Prüfungen"));
  assert(body("creator-terms", "public", "de").includes("Meinen Namen auf der öffentlichen Designs-Seite zeigen"));
});

test("the Creator Terms state the age of a creator and what erasure does", () => {
  const scope = { en: "18", ar: "١٨", de: "18" };
  const erased = { en: "account is erased", ar: "محو حسابك", de: "Konto gelöscht wird" };
  for (const lang of ["en", "ar", "de"]) {
    assert(body("creator-terms", "scope", lang).includes(scope[lang]), lang);
    assert(body("creator-terms", "licence", lang).includes(erased[lang]), lang);
  }
  assert(!body("creator-terms", "removal", "en").includes("removed effect are told"));
});

test("the Privacy Policy says what erasure does to designs", () => {
  const words = {
    en: ["your items and these records are deleted", "Your designs, published or not, and their files go too"],
    ar: ["تُحذف عناصرك وهذه السجلات", "تصاميمك، المنشورة وغير المنشورة، وملفاتها"],
    de: ["deine Elemente und diese Aufzeichnungen", "deine Designs, ob veröffentlicht oder nicht"],
  };
  for (const [lang, list] of Object.entries(words)) {
    for (const word of list) assert(all("privacy", lang).includes(word), `${lang} ${word}`);
    assert(!all("privacy", lang).includes("Q17.5"), lang);
  }
});

test("the Privacy Policy names effects, creators, links and what bots get, in all three languages", () => {
  const words = {
    en: ["profile effects", "links to other sites", "in what order", "rights confirmation", "Bots and plugins", "We do not record who opened your profile."],
    ar: ["مؤثرات الملف الشخصي", "الروابط إلى مواقع أخرى", "وترتيبها", "تأكيد حقوقك", "البوتات والإضافات", "ولا نسجّل من فتح ملفك الشخصي."],
    de: ["Profileffekte", "Links zu anderen Websites", "in welcher Reihenfolge", "Rechtebestätigung", "Bots und Plugins", "Wir speichern nicht, wer dein Profil geöffnet hat."],
  };
  for (const [lang, list] of Object.entries(words))
    for (const word of list) assert(all("privacy", lang).includes(word), `${lang} ${word}`);
  for (const lang of ["en", "ar", "de"]) assert(!all("privacy", lang).includes("P-23"), lang);
});

test("Enforcement and Appeals names profile effects where items are removed and reported", () => {
  const word = { en: "profile effect", ar: "مؤثر ملف شخصي", de: "Profileffekt" };
  const place = { en: "profile effect", ar: "مؤثر الملف الشخصي", de: "Profileffekt" };
  for (const lang of ["en", "ar", "de"]) {
    assert(body("enforcement-appeals", "actions", lang).includes(word[lang]), lang);
    assert(body("enforcement-appeals", "illegal-content", lang).includes(place[lang]), lang);
  }
});

test("Paid Services names only what Feather gives", () => {
  assert(!all("paid-services", "en").includes("profile customisation"));
  assert(!all("paid-services", "ar").includes("تخصيص الملف الشخصي"));
  assert(body("paid-services", "what", "en").includes("longer messages"));
  assert(body("paid-services", "what", "ar").includes("رسائل أطول"));
});

test("hub groups and footer links point at real policies", () => {
  const slugs = new Set(legalDocuments.map((doc) => doc.slug));
  const groups = new Set(legalGroups.map((group) => group.id));
  for (const doc of legalDocuments) assert(groups.has(doc.group), doc.slug);
  assert.deepEqual(
    legalFooterLinks.map((link) => en.labels[link.label]),
    ["Terms", "Privacy", "Community guidelines", "Developer terms", "Imprint", "Contact", "Paid services"],
  );
  for (const group of legalGroups) assert(en.labels[group.title], group.id);
  for (const link of legalFooterLinks) assert(slugs.has(link.slug));
});

test("the site routes every policy at /legal/<slug>", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert(app.includes("`/legal/${slug}`"));
  assert(app.includes("legalFooterLinks"));
  // the routes load without the long texts, so the short list must match them
  const { legalSlugs } = await import("../src/legal-nav.ts");
  assert.deepEqual(legalSlugs, legalDocuments.map((doc) => doc.slug));
  // direction comes from the language list (Arabic is right to left)
  assert(app.includes("root.dir = directionOf(code)"));
});

test("privacy names the services that run and none that were removed", () => {
  const privacy = legalDocuments.find((doc) => doc.slug === "privacy");
  for (const lang of ["en", "ar", "de"]) {
    const text = privacy.sections.map((s) => s.body[lang]).join("\n");
    for (const name of ["hCaptcha", "LiveKit", "Resend", "Stripe", "PayPal", "Klipy", "Cloudflare", "privacy@zrzur.com"])
      assert(text.includes(name), `${lang} ${name}`);
    for (const gone of ["Sentry", "Shield", "easypwned", "Tenor", "Lightspeed", "Zrzur@proton.me"])
      assert(!text.includes(gone), `${lang} ${gone}`);
  }
  assert(privacy.sections.some((s) => s.id === "players"));
});

test("privacy, imprint and enforcement have German bodies and use one contact address", () => {
  for (const slug of ["privacy", "imprint", "enforcement-appeals"]) {
    const d = legalDocuments.find((doc) => doc.slug === slug);
    for (const s of d.sections) assert(s.body.de?.trim() && s.title.de?.trim(), `${slug}#${s.id}`);
  }
  // zrzur@proton.me may appear only in the "Our official emails" section
  const withoutEmails = legalDocuments.map((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== "official-emails") }));
  assert(!/zrzur@proton.me/i.test(JSON.stringify(withoutEmails)));
});

test("enforcement page makes no claim the code does not keep", () => {
  const text = JSON.stringify(legalDocuments.find((d) => d.slug === "enforcement-appeals"));
  assert(!/did not make the original decision/.test(text));
  assert(!/removed automatically/.test(text));
  assert(/at least 6 months/.test(text));
});

// Owner brief 2026-11-10: translations may be shown, but each translated
// policy says the English (and, where complete, German) version is binding
// and links to it.
test("only English and complete German texts are binding", () => {
  for (const doc of legalDocuments) {
    const binding = bindingLanguages(doc);
    assert.equal(binding[0], "en", doc.slug);
    assert.equal(binding.includes("de"), hasLanguage(doc, "de"), doc.slug);
    assert(!binding.includes("ar"), doc.slug);
  }
  const privacy = legalDocuments.find((doc) => doc.slug === "privacy");
  assert.deepEqual(bindingLanguages(privacy), ["en", "de"]);
});

test("every page that is not a binding version says so and names the binding versions", () => {
  for (const doc of legalDocuments)
    for (const { code } of LOCALES) {
      const notice = bindingNotice(doc, code);
      if (bindingLanguages(doc).includes(code)) {
        assert.equal(notice, null, `${doc.slug} ${code}`);
        continue;
      }
      assert(notice, `${doc.slug} ${code} needs a notice`);
      assert.deepEqual(notice.binding, bindingLanguages(doc));
      // a page in its own language is a translation; otherwise the English text is shown
      assert.equal(notice.kind, hasLanguage(doc, code) ? "translation" : "english", `${doc.slug} ${code}`);
      assert.equal(shownLanguage(doc, code), hasLanguage(doc, code) ? code : "en");
    }
  // the Arabic privacy policy is a translation; the French one shows the English text
  const privacy = legalDocuments.find((doc) => doc.slug === "privacy");
  assert.deepEqual(bindingNotice(privacy, "ar"), { kind: "translation", binding: ["en", "de"] });
  assert.deepEqual(bindingNotice(privacy, "fr"), { kind: "english", binding: ["en", "de"] });
  // a German page of a policy without a German text shows the English one
  const terms = legalDocuments.find((doc) => doc.slug === "terms");
  assert.deepEqual(bindingNotice(terms, "de"), { kind: "english", binding: ["en"] });
});

test("the binding notice has its words in every language", async () => {
  const keys = ["legalTranslationNote", "legalEnglishNote", "legalBindingEn", "legalBindingEnDe", "legalReadEnglish", "legalReadGerman", "legalHubNote"];
  for (const { code } of LOCALES) {
    const { labels } = (await import(`../src/locales/${code}.ts`)).default;
    for (const key of keys) assert(labels[key]?.trim(), `${code} ${key}`);
  }
  const page = await readFile(new URL("../src/legal-page.tsx", import.meta.url), "utf8");
  // the notice links to each binding version, in its own language
  assert(page.includes("localizedPath(props.path, code)"));
  assert(page.includes("hreflang={tagOf(code)}"));
});
