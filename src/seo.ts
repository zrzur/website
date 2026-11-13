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

/**
 * What a search result shows. A result title holds about 60 characters and a
 * description about 155 (half of that in Chinese, whose characters are twice
 * as wide); the rest is cut mid-word by the search engine, so we cut first,
 * at a word. Shared by the app and scripts/prerender.mjs so both agree.
 */
const wide = (language: string) => language === "zh";
/** "Title — Zrzur", or the title alone when the name would push it past the limit */
export function metaTitle(title: string, brand: string, language: string): string {
  const clean = title.replace(/[.。]$/u, "");
  if (clean.includes(brand) && clean.length > brand.length + 4) return clean;
  const full = `${clean} — ${brand}`;
  return full.length <= (wide(language) ? 32 : 60) ? full : clean;
}
/** The description, whole when it fits, else cut at the last word that fits */
export function metaDescription(text: string, language: string): string {
  const limit = wide(language) ? 80 : 155;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  const at = wide(language) ? Math.max(cut.lastIndexOf("，"), cut.lastIndexOf("。"), cut.lastIndexOf("、")) : cut.lastIndexOf(" ");
  return `${cut.slice(0, at > limit * 0.6 ? at : cut.length).replace(/[\s,;:،؛，、—-]+$/u, "")}…`;
}
