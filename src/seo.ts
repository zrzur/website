/**
 * Which languages a page really exists in, for canonical links, hreflang
 * sets and the sitemap. Every page exists in every site language, except a
 * policy or a blog post without a text in that language: its page there
 * shows the English text, so it points at the English page and is left out
 * of the sets.
 * Shared by the app, scripts/prerender.mjs and scripts/generate-sitemap.mjs.
 */
import { LOCALES, type Language } from "./i18n.ts";
import { legalLanguages } from "./legal-nav.ts";
import { postLanguages } from "./blog-languages.ts";

/** The languages of a site path (without language prefix), in list order */
export function pageLanguages(path: string): Language[] {
  const clean = path.replace(/\/$/, "");
  const policy = clean.match(/^\/legal\/([a-z-]+)$/)?.[1];
  const post = clean.match(/^\/blog\/([a-z0-9-]+)$/)?.[1];
  const own = policy
    ? (legalLanguages as Record<string, Language[] | undefined>)[policy]
    : post
      ? (postLanguages as Record<string, readonly Language[] | undefined>)[post]
      : undefined;
  return LOCALES.map((locale) => locale.code).filter((code) => !own || own.includes(code));
}

/** The language whose address is canonical for this page shown in `language` */
export const canonicalLanguage = (path: string, language: Language): Language =>
  pageLanguages(path).includes(language) ? language : "en";
