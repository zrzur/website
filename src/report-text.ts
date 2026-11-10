import type { Language } from "./i18n.ts";
import type { CategoryId, FieldError, Kind } from "./report-logic.ts";

export { CONTACT_EMAIL } from "./report-contact.ts";

/** The words of the report form; title and intro are in the site words (reportTitle, reportIntro) */
export type ReportText = {
  kindLegend: string;
  kinds: Record<Kind, string>;
  locationLabel: string;
  locationHint: string;
  categoryLegend: string;
  categories: Record<CategoryId, string>;
  csamNote: string;
  descriptionLabel: string;
  descriptionHint: string;
  lawLabel: string;
  lawHint: string;
  nameLabel: string;
  emailLabel: string;
  optionalForCsam: string;
  contactHint: string;
  goodFaith: string;
  submit: string;
  sending: string;
  doneTitle: string;
  doneBody: string;
  referenceLabel: string;
  receiptMail: string;
  another: string;
  errors: Record<FieldError, string>;
  failed: string;
  tooMany: string;
  captchaFailed: string;
  unavailable: string;
  details: string;
  privacy: string;
  privacyLink: string;
  captchaNote: string;
  inApp: string;
};

/** One file per language (src/report-text/<code>.ts): the form downloads only its own */
export const reportTextLoaders: Record<Language, () => Promise<{ default: ReportText }>> = {
  en: () => import("./report-text/en.ts"),
  de: () => import("./report-text/de.ts"),
  ar: () => import("./report-text/ar.ts"),
  fr: () => import("./report-text/fr.ts"),
  es: () => import("./report-text/es.ts"),
  ru: () => import("./report-text/ru.ts"),
  zh: () => import("./report-text/zh.ts"),
};
