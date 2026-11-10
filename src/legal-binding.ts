/**
 * Which version of a policy is binding, and what a page in another language
 * must say about it. The policies are binding in English and, where a full
 * German text exists, in German (BINDING_LANGUAGES). Every other page is a
 * translation to help people read, or the English text when there is none:
 * it says so at the top and links to the binding versions.
 */
import { BINDING_LANGUAGES, type Language } from "./i18n.ts";
import type { LegalDocument } from "./policies/shared.ts";

/** A full text in this language: the title and every section */
export const hasLanguage = (doc: LegalDocument, language: Language) =>
  Boolean(doc.title[language]?.trim()) &&
  doc.sections.every((section) => section.title[language]?.trim() && section.body[language]?.trim());

/** The language a policy page shows its text in: the page's own, or English */
export const shownLanguage = (doc: LegalDocument, language: Language): Language =>
  hasLanguage(doc, language) ? language : "en";

/** The binding versions of one policy: English, plus German when it is complete */
export const bindingLanguages = (doc: LegalDocument): Language[] =>
  BINDING_LANGUAGES.filter((language) => hasLanguage(doc, language));

export type BindingNotice = {
  /** "translation": the text is in the page language; "english": the page shows the English text */
  kind: "translation" | "english";
  /** The versions to link to, each binding */
  binding: Language[];
};

/** What a policy page says about the binding version; null on a binding page */
export function bindingNotice(doc: LegalDocument, language: Language): BindingNotice | null {
  const binding = bindingLanguages(doc);
  if (binding.includes(language)) return null;
  return { kind: hasLanguage(doc, language) ? "translation" : "english", binding };
}
