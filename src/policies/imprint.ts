import { SOURCE_URL } from "../buildInfo.ts";
import { officialEmails } from "./contact.ts";
import { doc, section } from "./shared.ts";

// Text in square brackets is still to be supplied.

export const imprint = doc({
  slug: "imprint",
  group: "operator",
  title: { en: "Operator Information", ar: "بيانات الجهة المشغّلة",
    de: "Impressum (Betreiberangaben)" },
  intro: {
    en: "The legal details of the operator of Zrzur (E-Commerce Act § 5, Media Act § 25). The owner must fill in every bracket before this page is published.",
    ar: "البيانات القانونية للجهة المشغّلة لزرزور (المادة 5 من قانون التجارة الإلكترونية النمساوي، والمادة 25 من قانون الإعلام). ويجب على المالك تعبئة كل خانة بين قوسين قبل نشر هذه الصفحة.",
    de: "Die rechtlichen Angaben zum Betreiber von Zrzur (§ 5 E-Commerce-Gesetz, § 25 Mediengesetz). Der Inhaber muss vor der Veröffentlichung jede Klammer ausfüllen.",
  },
  sections: [
    section(
      "operator",
      { en: "Operator", ar: "الجهة المشغّلة", de: "Betreiber" },
      {
        en: "[Operator legal name]\n[Legal form]",
        ar: "[Operator legal name]\n[Legal form]",
        de: "[Operator legal name]\n[Legal form]",
      },
    ),
    section(
      "address",
      { en: "Address", ar: "العنوان", de: "Anschrift" },
      { en: "[Address]", ar: "[Address]", de: "[Address]" },
    ),
    section(
      "registration",
      { en: "Registration and tax", ar: "التسجيل والضرائب", de: "Register und Steuer" },
      {
        en: "Company register number and court: [Registration number and court, if registered]\nVAT ID (UID): [VAT ID, if any]",
        ar: "رقم السجل التجاري والمحكمة: [Registration number and court, if registered]\nرقم التعريف الضريبي (UID): [VAT ID, if any]",
        de: "Firmenbuchnummer und Gericht: [Registration number and court, if registered]\nUID-Nummer: [VAT ID, if any]",
      },
    ),
    section(
      "authority",
      { en: "Supervisory authority, chamber and trade rules", ar: "جهة الرقابة والغرفة والقواعد المهنية", de: "Aufsichtsbehörde, Kammer und Berufsrecht" },
      {
        en: "Trade authority (Gewerbebehörde): [Trade authority]\nChamber membership: [Chamber, if any]\nTrade rules: [Trade rules and where to read them, if any]",
        ar: "جهة الرقابة على النشاط التجاري (Gewerbebehörde): [Trade authority]\nالعضوية في الغرفة: [Chamber, if any]\nالقواعد المهنية: [Trade rules and where to read them, if any]",
        de: "Gewerbebehörde: [Trade authority]\nKammerzugehörigkeit: [Chamber, if any]\nBerufsrecht: [Trade rules and where to read them, if any]",
      },
    ),
    section(
      "contact",
      { en: "Contact", ar: "التواصل", de: "Kontakt" },
      {
        en: "Email: support@zrzur.com\nPhone: [Phone number, if required]",
        ar: "البريد الإلكتروني: support@zrzur.com\nالهاتف: [Phone number, if required]",
        de: "E-Mail: support@zrzur.com\nTelefon: [Phone number, if required]",
      },
    ),
    officialEmails(),
    section(
      "media",
      { en: "Media Act disclosure (§ 25 MedienG)", ar: "الإفصاح بموجب قانون الإعلام (المادة 25)", de: "Offenlegung nach § 25 Mediengesetz" },
      {
        en: "Owner of the medium: [Name and address of the media owner]\nBusiness purpose: [Business purpose]\nBasic direction (Grundlegende Richtung) of the site: [Basic direction]\nPerson responsible for content: [Name and address, if required]",
        ar: "مالك الوسيلة: [Name and address of the media owner]\nالغرض التجاري: [Business purpose]\nالتوجّه الأساسي للموقع: [Basic direction]\nالمسؤول عن المحتوى: [Name and address, if required]",
        de: "Medieninhaber: [Name and address of the media owner]\nUnternehmensgegenstand: [Business purpose]\nGrundlegende Richtung der Website: [Basic direction]\nFür den Inhalt verantwortlich: [Name and address, if required]",
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
