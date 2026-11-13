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

test("no policy shows a draft banner, a lawyer note or a placeholder (owner, 2026-11-12)", () => {
  for (const doc of legalDocuments) {
    assert.equal("banner" in doc, false, doc.slug);
    assert.equal(doc.lastUpdated.en, "Last updated: 12 November 2026", doc.slug);
    assert.equal(doc.lastUpdated.ar, "آخر تحديث: ١٢ نوفمبر ٢٠٢٦", doc.slug);
    assert.equal(doc.lastUpdated.de, "Stand: 12. November 2026", doc.slug);
    assert.deepEqual(doc.sources, []);
    const text = JSON.stringify(doc);
    for (const word of ["lawyer", "محامٍ", "محام", "anwaltlich", "Entwurf", "مسودة", "Owner to confirm", "<date>"])
      assert(!text.includes(word), `${doc.slug}: ${word}`);
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
    // our own hosts, and the European Commission's list of dispute settlement bodies (DSA Art. 21)
    assert(/^https:\/\/(github\.com\/zrzur|([a-z0-9-]+\.)?zrzur\.(com|cc)|digital-strategy\.ec\.europa\.eu\/)/.test(url), url);
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

test("policyVersions covers every slug with the policy date", () => {
  assert.deepEqual(Object.keys(policyVersions).sort(), [...EXPECTED_SLUGS].sort());
  assert.equal(CREATOR_TERMS_VERSION, "2026-11-12");
  for (const slug of EXPECTED_SLUGS) assert.equal(policyVersions[slug], "2026-11-12", slug);
});

test("the site footer says nothing about drafts or legal review", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert(!app.includes("draftNote"));
  for (const code of ["ar", "en", "de"]) {
    const locale = await readFile(new URL(`../src/locales/${code}.ts`, import.meta.url), "utf8");
    assert(!locale.includes("draftNote"), code);
  }
});

const policy = (slug) => legalDocuments.find((doc) => doc.slug === slug);
const body = (slug, id, lang) => policy(slug).sections.find((s) => s.id === id).body[lang];
const all = (slug, lang) => policy(slug).sections.map((s) => s.body[lang]).join("\n");

test("the Creator Terms say what the code does", () => {
  assert.equal(CREATOR_TERMS_VERSION, "2026-11-12");
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
    for (const name of ["hCaptcha", "LiveKit", "Resend", "Stripe", "PayPal", "Cloudflare", "privacy@zrzur.com"])
      assert(text.includes(name), `${lang} ${name}`);
    // GIF search (Klipy) is off: the service list does not name it
    const processors = privacy.sections.find((s) => s.id === "processors").body[lang];
    assert(!processors.includes("Klipy"), `${lang} Klipy`);
    for (const left of ["[country]", "owner to confirm", "Transfer safeguard"])
      assert(!text.includes(left), `${lang} ${left}`);
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
  // every policy has a German text now, so the German terms page is binding itself
  const terms = legalDocuments.find((doc) => doc.slug === "terms");
  assert.equal(bindingNotice(terms, "de"), null);
  assert.deepEqual(bindingNotice(terms, "fr"), { kind: "english", binding: ["en", "de"] });
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

// Review 2026-11-10: a policy page that shows the English text under another
// language prefix is not a page of its own: its canonical is the English
// address, and it stays out of the hreflang sets and the sitemap.
test("the language list per policy matches the texts", async () => {
  const { legalLanguages } = await import("../src/legal-nav.ts");
  for (const doc of legalDocuments) {
    const real = LOCALES.map((l) => l.code).filter((code) => code === "en" || hasLanguage(doc, code));
    assert.deepEqual([...legalLanguages[doc.slug]].sort(), real.sort(), doc.slug);
  }
});

// Legal check 2026-11-12 (F-2): every policy is complete in German, not only
// in English and Arabic, so no German page falls back to English.
test("every policy is complete in English, Arabic and German", () => {
  for (const doc of legalDocuments)
    for (const code of ["en", "ar", "de"]) assert(hasLanguage(doc, code), `${doc.slug} ${code}`);
});

test("pages in English under another prefix point at the English page", async () => {
  const { canonicalLanguage, pageLanguages } = await import("../src/seo.ts");
  assert.deepEqual(pageLanguages("/legal/privacy").toSorted(), ["ar", "de", "en"]);
  assert.equal(canonicalLanguage("/legal/privacy", "fr"), "en");
  assert.equal(canonicalLanguage("/legal/privacy", "de"), "de");
  assert.equal(canonicalLanguage("/legal/terms", "de"), "de");
  assert.equal(canonicalLanguage("/legal/terms", "fr"), "en");
  assert.equal(canonicalLanguage("/legal/terms", "ar"), "ar");
  // every other page exists in every language
  assert.equal(pageLanguages("/features").length, LOCALES.length);
  assert.equal(pageLanguages("/legal").length, LOCALES.length);
  assert.equal(canonicalLanguage("/report", "zh"), "zh");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert(!sitemap.includes("https://zrzur.com/fr/legal/privacy"));
  assert(!sitemap.includes('hreflang="fr" href="https://zrzur.com/fr/legal/privacy"'));
  assert(sitemap.includes("<loc>https://zrzur.com/ar/legal/privacy</loc>"));
  assert(sitemap.includes("<loc>https://zrzur.com/fr/legal</loc>"));
});
