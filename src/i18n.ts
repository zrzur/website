/**
 * Website languages. Only fully translated languages are listed (owner
 * decision 2026-11-01): a language joins this list once every key in
 * content.ts has a reviewed translation; test/i18n.test.mjs enforces that.
 * English lives at the root, the others under /<code>/ (e.g. /de/download).
 */
export const LOCALES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
] as const;

export type Language = (typeof LOCALES)[number]["code"];
export const DEFAULT_LANGUAGE: Language = "en";
const STORAGE_KEY = "zrzur-site-language";

export const isLanguage = (value: string | null | undefined): value is Language =>
  LOCALES.some((locale) => locale.code === value);

export const directionOf = (language: Language) =>
  LOCALES.find((locale) => locale.code === language)!.dir;

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
    const base = tag.toLowerCase().split("-")[0];
    if (isLanguage(base)) return base;
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
