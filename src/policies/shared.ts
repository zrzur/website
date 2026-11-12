// legal texts exist in English, Arabic and German for every document; English
// is the source text and German is a translation of it
import type { Partial as Localized } from "../content";

export type LegalSlug =
  | "contact"
  | "terms"
  | "privacy"
  | "community-guidelines"
  | "enforcement-appeals"
  | "paid-services"
  | "server-owner-rules"
  | "discover-guidelines"
  | "developer-terms"
  | "plugin-policy"
  | "creator-terms"
  | "imprint";

/** Groups used by the legal hub and the side navigation. */
export type LegalGroup = "everyone" | "servers" | "builders" | "operator";

export type LegalSection = { id: string; title: Localized; body: Localized };

export type LegalDocument = {
  slug: LegalSlug;
  group: LegalGroup;
  title: Localized;
  intro: Localized;
  /** Visible draft banner. Every document carries it until a lawyer approves it. */
  banner: Localized;
  lastUpdated: Localized;
  /** Version string; the app re-asks acceptance when it changes. */
  version: string;
  sections: LegalSection[];
  sources: string[];
};

export const POLICY_DATE = "2026-11-04";

export const draftBanner: Localized = {
  en: "Draft — to be reviewed by a lawyer before it takes effect.",
  de: "Entwurf – wird vor Inkrafttreten anwaltlich geprüft.",
  ar: "مسودة — تحتاج مراجعة محامٍ قبل اعتمادها.",
};

export const lastUpdated: Localized = {
  en: "Last updated: 4 November 2026",
  ar: "آخر تحديث: ٤ نوفمبر ٢٠٢٦",
  de: "Stand: 4. November 2026",
};

/** Date of the policies changed since {@link POLICY_DATE} */
export const REVISED_DATE = "2026-11-07";

/** A policy changed since the others: its own date and a new version. */
export const revised = (document: LegalDocument): LegalDocument => ({
  ...document,
  lastUpdated: {
    en: "Last updated: 7 November 2026",
    ar: "آخر تحديث: ٧ نوفمبر ٢٠٢٦",
    de: "Stand: 7. November 2026",
  },
  version: REVISED_DATE,
});

/**
 * Section bodies are plain text. Blocks are separated by a blank line.
 * A block whose lines all start with "- " is rendered as a bullet list.
 */
export const para = (...blocks: string[]) => blocks.join("\n\n");
export const list = (...items: string[]) =>
  items.map((item) => `- ${item}`).join("\n");

export const section = (
  id: string,
  title: Localized,
  body: Localized,
): LegalSection => ({ id, title, body });

export const doc = (
  value: Omit<LegalDocument, "banner" | "lastUpdated" | "version" | "sources">,
): LegalDocument => ({
  ...value,
  banner: draftBanner,
  lastUpdated,
  version: POLICY_DATE,
  sources: [],
});
