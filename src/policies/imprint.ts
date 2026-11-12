import { SOURCE_URL } from "../buildInfo.ts";
import { dsaContact, officialEmails } from "./contact.ts";
import { doc, section } from "./shared.ts";

export const imprint = doc({
  slug: "imprint",
  group: "operator",
  title: { en: "Operator Information", ar: "بيانات الجهة المشغّلة",
    de: "Impressum (Betreiberangaben)" },
  intro: {
    en: "Who runs Zrzur and how to reach us (§ 5 E-Commerce Act, § 25 Media Act).",
    ar: "من يدير زرزور وكيف تتواصل معنا (المادة 5 من قانون التجارة الإلكترونية النمساوي، والمادة 25 من قانون الإعلام).",
    de: "Wer Zrzur betreibt und wie du uns erreichst (§ 5 E-Commerce-Gesetz, § 25 Mediengesetz).",
  },
  sections: [
    section(
      "operator",
      { en: "Operator", ar: "الجهة المشغّلة", de: "Betreiber" },
      {
        en: "Zrzur is an experimental, non-commercial project in its beta phase, run from Austria by the Zrzur team. Nothing can be bought on Zrzur. We will add the operator's full name and postal address here before that changes.",
        ar: "زرزور مشروع تجريبي غير تجاري في مرحلة البيتا، يديره فريق زرزور من النمسا. ولا يمكن شراء أي شيء في زرزور. وسنضيف هنا الاسم الكامل للجهة المشغّلة وعنوانها البريدي قبل أن يتغيّر ذلك.",
        de: "Zrzur ist ein experimentelles, nicht kommerzielles Projekt in der Beta-Phase, betrieben vom Zrzur-Team aus Österreich. Auf Zrzur kann nichts gekauft werden. Den vollständigen Namen und die Postanschrift des Betreibers ergänzen wir hier, bevor sich das ändert.",
      },
    ),
    section(
      "contact",
      { en: "Contact", ar: "التواصل", de: "Kontakt" },
      {
        en: "General: hello@zrzur.com\nSupport: support@zrzur.com",
        ar: "التواصل العام: hello@zrzur.com\nالدعم: support@zrzur.com",
        de: "Allgemeiner Kontakt: hello@zrzur.com\nSupport: support@zrzur.com",
      },
    ),
    officialEmails(),
    dsaContact(),
    section(
      "media",
      { en: "Media Act disclosure (§ 25 MedienG)", ar: "الإفصاح بموجب قانون الإعلام (المادة 25)", de: "Offenlegung nach § 25 Mediengesetz" },
      {
        en: "Media owner: the Zrzur team, Austria.\nPurpose: running the Zrzur chat service and this website.\nBasic direction: information about Zrzur and how to use it.",
        ar: "مالك الوسيلة: فريق زرزور، النمسا.\nالغرض: تشغيل خدمة زرزور للمحادثة وهذا الموقع.\nالتوجّه الأساسي: معلومات عن زرزور وطريقة استخدامه.",
        de: "Medieninhaber: Zrzur-Team, Österreich.\nUnternehmensgegenstand: Betrieb des Chat-Dienstes Zrzur und dieser Website.\nGrundlegende Richtung: Informationen über Zrzur und seine Nutzung.",
      },
    ),
    section(
      "source",
      { en: "Source code", ar: "الشيفرة المصدرية", de: "Quellcode" },
      {
        en: `Zrzur is free software under the GNU Affero General Public License v3.0. The source code of this version is available at ${SOURCE_URL}.`,
        ar: `زرزور برمجيات حرّة بموجب رخصة جنو أفيرو العمومية العامة، الإصدار الثالث. والشيفرة المصدرية لهذا الإصدار متاحة على ${SOURCE_URL}.`,
        de: `Zrzur ist freie Software unter der GNU Affero General Public License v3.0. Der Quellcode dieser Version ist unter ${SOURCE_URL} verfügbar.`,
      },
    ),
  ],
});
