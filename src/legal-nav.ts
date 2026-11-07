import type { Partial as Localized } from "./content";
import type { LegalGroup, LegalSlug } from "./policies/shared.ts";

/** What every page needs about the policies, without their long texts */
export const legalSlugs: LegalSlug[] = [
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

export const legalGroups: { id: LegalGroup; title: Localized }[] = [
  { id: "everyone", title: { en: "For everyone", de: "Für alle", ar: "للجميع" } },
  { id: "servers", title: { en: "Servers and Discover", de: "Server und Entdecken", ar: "السيرفرات و«اكتشف»" } },
  { id: "builders", title: { en: "Developers and creators", de: "Entwickler und Creator", ar: "المطوّرون والمبدعون" } },
  { id: "operator", title: { en: "Operator", de: "Betreiber", ar: "الجهة المشغّلة" } },
];

/** Short footer links. */
export const legalFooterLinks: { slug: LegalSlug; label: Localized }[] = [
  { slug: "terms", label: { en: "Terms", de: "Nutzungsbedingungen", ar: "الشروط" } },
  { slug: "privacy", label: { en: "Privacy", de: "Datenschutz", ar: "الخصوصية" } },
  { slug: "community-guidelines", label: { en: "Community guidelines", de: "Community-Richtlinien", ar: "إرشادات المجتمع" } },
  { slug: "developer-terms", label: { en: "Developer terms", de: "Entwicklerbedingungen", ar: "شروط المطوّرين" } },
  { slug: "imprint", label: { en: "Imprint", de: "Impressum", ar: "بيانات الجهة المشغّلة" } },
  { slug: "contact", label: { en: "Contact", de: "Kontakt", ar: "التواصل" } },
  { slug: "paid-services", label: { en: "Paid services", de: "Kostenpflichtige Dienste", ar: "الخدمات المدفوعة" } },
];
