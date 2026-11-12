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
  lastUpdated: Localized;
  /** Version string; the app re-asks acceptance when it changes. */
  version: string;
  sections: LegalSection[];
  sources: string[];
};

/** Date and version of every policy: all were revised on 12 November 2026. */
export const POLICY_DATE = "2026-11-12";

export const lastUpdated: Localized = {
  en: "Last updated: 12 November 2026",
  ar: "آخر تحديث: ١٢ نوفمبر ٢٠٢٦",
  de: "Stand: 12. November 2026",
};

/**
 * Marks a policy that changed after the first version. Every policy now
 * carries {@link POLICY_DATE}; a later change gives its own date here.
 */
export const revised = (document: LegalDocument): LegalDocument => document;

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
  value: Omit<LegalDocument, "lastUpdated" | "version" | "sources">,
): LegalDocument => ({
  ...value,
  lastUpdated,
  version: POLICY_DATE,
  sources: [],
});
