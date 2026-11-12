import type { Partial as Localized } from "../content";
import { doc, list, para, section } from "./shared.ts";

/** Sentence on where our replies come from. Goes when mail moves to a paid plan. */
const repliesFrom: Localized = {
  en: "Our replies currently come from zrzur@proton.me, the official address of the Zrzur team.",
  ar: "تصلك ردودنا حاليًا من zrzur@proton.me، وهو العنوان الرسمي لفريق زرزور.",
  de: "Unsere Antworten kommen derzeit von zrzur@proton.me, der offiziellen Adresse des Zrzur-Teams.",
};

const neverAsks: Localized = {
  en: "Zrzur will never ask for your password or verification code by email.",
  ar: "لن يطلب منك زرزور أبدًا كلمة المرور أو رمز التحقق عبر البريد الإلكتروني.",
  de: "Zrzur fragt Sie per E-Mail nie nach Ihrem Passwort oder Bestätigungscode.",
};

/** The section "Our official emails", shared by the contact page and the imprint */
export const officialEmails = () =>
  section(
    "official-emails",
    { en: "Our official emails", ar: "عناوين بريدنا الرسمية", de: "Unsere offiziellen E-Mail-Adressen" },
    {
      en: para(
        list(
          "hello@zrzur.com: general contact",
          "support@zrzur.com: support",
          "security@zrzur.com: security vulnerabilities",
          "privacy@zrzur.com: privacy and data requests",
          "dsa@zrzur.com: public authorities",
          "legal@zrzur.com: legal matters",
          "abuse@zrzur.com: abuse reports",
          "press@zrzur.com: press",
          "developers@zrzur.com: developers",
        ),
        repliesFrom.en!,
        neverAsks.en!,
      ),
      ar: para(
        list(
          "hello@zrzur.com: التواصل العام",
          "support@zrzur.com: الدعم",
          "security@zrzur.com: الثغرات الأمنية",
          "privacy@zrzur.com: الخصوصية وطلبات البيانات",
          "dsa@zrzur.com: الجهات الرسمية",
          "legal@zrzur.com: الشؤون القانونية",
          "abuse@zrzur.com: بلاغات الإساءة",
          "press@zrzur.com: الصحافة",
          "developers@zrzur.com: المطوّرون",
        ),
        repliesFrom.ar!,
        neverAsks.ar!,
      ),
      de: para(
        list(
          "hello@zrzur.com: allgemeiner Kontakt",
          "support@zrzur.com: Support",
          "security@zrzur.com: Sicherheitslücken",
          "privacy@zrzur.com: Datenschutz und Datenanfragen",
          "dsa@zrzur.com: Behörden",
          "legal@zrzur.com: rechtliche Angelegenheiten",
          "abuse@zrzur.com: Missbrauchsmeldungen",
          "press@zrzur.com: Presse",
          "developers@zrzur.com: Entwickler",
        ),
        repliesFrom.de!,
        neverAsks.de!,
      ),
    },
  );

export const contact = doc({
  slug: "contact",
  group: "operator",
  title: { en: "Contact and security", ar: "التواصل والأمان", de: "Kontakt und Sicherheit" },
  intro: {
    en: "How to reach the Zrzur team, and how to report a security problem.",
    ar: "كيف تتواصل مع فريق زرزور، وكيف تبلّغ عن مشكلة أمنية.",
    de: "So erreichen Sie das Zrzur-Team und melden ein Sicherheitsproblem.",
  },
  sections: [
    officialEmails(),
    section(
      "security",
      { en: "Report a security problem", ar: "الإبلاغ عن مشكلة أمنية", de: "Sicherheitsproblem melden" },
      {
        en: "Write to security@zrzur.com and describe the problem and how to reproduce it. Do not post it in public, and do not access other people's data.",
        ar: "راسل security@zrzur.com، واشرح المشكلة وكيفية تكرارها. لا تنشرها علنًا، ولا تطّلع على بيانات الآخرين.",
        de: "Schreiben Sie an security@zrzur.com und beschreiben Sie das Problem und wie es sich nachstellen lässt. Veröffentlichen Sie es nicht und greifen Sie nicht auf Daten anderer zu.",
      },
    ),
  ],
});
