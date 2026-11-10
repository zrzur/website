import test from "node:test";
import assert from "node:assert/strict";

import {
  CATEGORY_IDS,
  LIMITS,
  buildPayload,
  readPrefill,
  resolveReportApi,
  validateForm,
} from "../src/report-logic.ts";
import { CONTACT_EMAIL } from "../src/report-text.ts";
import { LOCALES } from "../src/i18n.ts";

/** the form words of every language, one file each as the page loads them */
const reportText = Object.fromEntries(
  await Promise.all(LOCALES.map(async ({ code }) => [code, (await import(`../src/report-text/${code}.ts`)).default])),
);

const form = {
  kind: "Message",
  location: "https://app.zrzur.com/channel/x/y",
  category: "illegal",
  description: "This message sells stolen goods",
  law: "",
  name: "Sam",
  email: "sam@example.org",
  goodFaith: true,
};

test("a complete form is valid", () => {
  assert.deepEqual(validateForm(form), []);
});

test("good faith, name and email are required", () => {
  assert.deepEqual(validateForm({ ...form, goodFaith: false }), ["goodFaith"]);
  assert.deepEqual(validateForm({ ...form, name: "", email: "" }), ["name", "email"]);
  assert.deepEqual(validateForm({ ...form, email: "nope" }), ["email"]);
});

test("child sexual abuse material needs no name or email", () => {
  const csam = { ...form, category: "csam", name: "", email: "" };
  assert.deepEqual(validateForm(csam), []);
  const body = buildPayload(csam, "ar");
  assert.equal(body.category, "SexualContent");
  assert.equal(body.subcategory, "minor_safety");
  assert.equal(body.name, undefined);
  assert.equal(body.email, undefined);
  // a wrong address is still refused when one is given
  assert.deepEqual(validateForm({ ...csam, email: "nope" }), ["email"]);
});

test("sizes are limited", () => {
  assert.deepEqual(validateForm({ ...form, description: "short" }), ["description"]);
  assert.deepEqual(validateForm({ ...form, description: "x".repeat(2001) }), ["description"]);
  assert.deepEqual(validateForm({ ...form, location: "" }), ["location"]);
});

test("the payload carries the page language", () => {
  assert.equal(buildPayload(form, "de").language, "de");
  assert.equal(buildPayload(form, "de").target_kind, "Message");
});

test("only approved API addresses are used", () => {
  assert.equal(resolveReportApi("zrzur.com", "https://api.zrzur.com/"), "https://api.zrzur.com");
  assert.equal(resolveReportApi("zrzur.com", "https://stoat.chat"), null);
  assert.equal(resolveReportApi("zrzur.com", undefined), null);
  assert.equal(resolveReportApi("127.0.0.1", undefined), "http://127.0.0.1:14702");
});

test("every language has every text and category", () => {
  const base = reportText.en;
  for (const { code } of LOCALES) {
    const t = reportText[code];
    assert.deepEqual(Object.keys(t).sort(), Object.keys(base).sort(), code);
    for (const id of CATEGORY_IDS) assert(t.categories[id]?.trim(), `${code} ${id}`);
    for (const [k, v] of Object.entries(t)) if (typeof v === "string") assert(v.trim(), `${code} ${k}`);
  }
});

test("a threat to life is sent as a violent threat and more kinds can be reported", () => {
  const body = buildPayload({ ...form, category: "threat", kind: "Attachment" }, "en");
  assert.equal(body.category, "HateOrThreats");
  assert.equal(body.subcategory, "violent_threat");
  assert.equal(body.target_kind, "Attachment");
  for (const kind of ["DiscoverServer", "CommunityItem"]) assert(reportText.en.kinds[kind]);
});

test("a flashing effect goes to the server as Other, flashing, and is named in every language", () => {
  const body = buildPayload({ ...form, category: "flashing", kind: "CommunityItem" }, "en");
  assert.equal(body.category, "Other");
  assert.equal(body.subcategory, "flashing");
  assert.equal(body.target_kind, "CommunityItem");
  assert(CATEGORY_IDS.includes("flashing"));
});

test("a profile effect can be named as what is reported", () => {
  const words = { en: "profile effect", de: "Profileffekt", ar: "مؤثر", fr: "effet de profil", es: "efecto de perfil", ru: "эффект профиля", zh: "个人资料特效" };
  for (const { code } of LOCALES) {
    assert(reportText[code].kinds.CommunityItem.includes(words[code]), code);
    assert(reportText[code].locationHint.includes(words[code]), code);
  }
});

test("a failed check names the address to write to, in every language", () => {
  for (const { code } of LOCALES) {
    assert(reportText[code].captchaFailed.includes(CONTACT_EMAIL), code);
  }
});

test("the location hint names every kind that can be reported", () => {
  const words = {
    en: ["message", "server", "profile", "Discover listing", "design", "file"],
    de: ["Nachricht", "Server", "Profil", "„Entdecken“", "Design", "Datei"],
    ar: ["الرسالة", "السيرفر", "الملف الشخصي", "«اكتشف»", "التصميم", "الملف"],
    fr: ["message", "serveur", "profil", "Découvrir", "design", "fichier"],
    es: ["mensaje", "servidor", "perfil", "Descubrir", "diseño", "archivo"],
    ru: ["сообщение", "сервер", "профиль", "Обзоре", "дизайн", "файл"],
    zh: ["消息", "服务器", "个人资料", "“发现”", "设计", "文件"],
  };
  for (const { code } of LOCALES) {
    for (const word of words[code]) assert(reportText[code].locationHint.includes(word), `${code} ${word}`);
  }
});

test("the address can fill in what is reported", () => {
  const search = "?kind=DiscoverServer&location=https%3A%2F%2Fdiscover.zrzur.com%2Frabea";
  assert.deepEqual(readPrefill(search), {
    kind: "DiscoverServer",
    location: "https://discover.zrzur.com/rabea",
  });
  assert.deepEqual(readPrefill(""), { kind: undefined, location: "" });
  assert.equal(readPrefill("?kind=Nonsense").kind, undefined);
  assert.equal(readPrefill(`?location=${"x".repeat(900)}`).location.length, LIMITS.location);
});
