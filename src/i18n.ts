/**
 * Website languages. Only fully translated languages are listed (owner
 * decision 2026-11-01): a language joins this list once every key of the
 * English strings (src/locales/en.ts) has a reviewed translation;
 * test/i18n.test.mjs enforces that. English lives at the root, the others
 * under /<code>/ (e.g. /de/download). `tag` is the BCP 47 tag the page
 * announces (lang, hreflang); Chinese is Simplified Chinese at /zh/.
 */
export const LOCALES = [
  { code: "en", tag: "en", name: "English", dir: "ltr" },
  { code: "de", tag: "de", name: "Deutsch", dir: "ltr" },
  { code: "ar", tag: "ar", name: "العربية", dir: "rtl" },
  { code: "fr", tag: "fr", name: "Français", dir: "ltr" },
  { code: "es", tag: "es", name: "Español", dir: "ltr" },
  { code: "ru", tag: "ru", name: "Русский", dir: "ltr" },
  { code: "zh", tag: "zh-Hans", name: "简体中文", dir: "ltr" },
] as const;

export type Language = (typeof LOCALES)[number]["code"];
export const DEFAULT_LANGUAGE: Language = "en";
/**
 * The policies are binding in these languages only; every other language
 * shows a translation (or the English text) with a link to them.
 */
export const BINDING_LANGUAGES: readonly Language[] = ["en", "de"];
const STORAGE_KEY = "zrzur-site-language";

export const isLanguage = (value: string | null | undefined): value is Language =>
  LOCALES.some((locale) => locale.code === value);

const localeOf = (language: Language) => LOCALES.find((locale) => locale.code === language)!;
export const directionOf = (language: Language) => localeOf(language).dir;
/** The tag for lang="" and hreflang="": zh → zh-Hans */
export const tagOf = (language: Language): string => localeOf(language).tag;

/** "/de/download" → { language: "de", path: "/download" } */
export function splitLocale(pathname: string): { language: Language | null; path: string } {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && isLanguage(match[1]) && match[1] !== DEFAULT_LANGUAGE)
    return { language: match[1], path: match[2] || "/" };
  return { language: null, path: pathname || "/" };
}

/** The same page in another language: "/download" + "de" → "/de/download" */
export function localizedPath(path: string, language: Language): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (language === DEFAULT_LANGUAGE) return clean;
  return clean === "/" ? `/${language}/` : `/${language}${clean}`;
}

/**
 * One browser language tag to a site language. Chinese counts only in its
 * simplified script: zh, zh-CN, zh-SG, zh-Hans-*; zh-TW, zh-HK, zh-MO and
 * zh-Hant-* are traditional script and are not offered as Simplified Chinese.
 */
export function languageOfTag(tag: string): Language | null {
  const parts = tag.toLowerCase().split(/[-_]/);
  const base = parts[0];
  if (base === "zh") {
    if (parts.includes("hant") || ["tw", "hk", "mo"].some((region) => parts.includes(region))) return null;
    return "zh";
  }
  return isLanguage(base) ? base : null;
}

/**
 * Language for this visit: the URL wins, then a saved choice, then the
 * browser's preferred languages, then English.
 */
export function detectLanguage(
  pathname: string,
  saved: string | null,
  preferred: readonly string[],
): Language {
  const fromUrl = splitLocale(pathname).language;
  if (fromUrl) return fromUrl;
  if (isLanguage(saved)) return saved;
  for (const tag of preferred) {
    const language = languageOfTag(tag);
    if (language) return language;
  }
  return DEFAULT_LANGUAGE;
}

export function readSavedLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLanguage(language: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    /* the site works without storage */
  }
}
