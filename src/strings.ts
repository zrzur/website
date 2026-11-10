/**
 * The site's words, one file per language (src/locales/<code>.ts). Each file
 * is its own chunk: a page downloads only the words of its language, and the
 * prerendered page preloads that chunk next to the app (scripts/prerender.mjs).
 */
import type { Language } from "./i18n";
import type { Labels } from "./locales/en";

export type { Labels };
export type Label = keyof Labels;
export type FeatureId = "channels" | "voice" | "sharing" | "roles" | "interests" | "discover" | "appearance" | "open";
export type Pack = {
  labels: Labels;
  features: Record<FeatureId, { title: string; body: string }>;
  faqs: { question: string; answer: string }[];
};

/** One dynamic import per language: Vite splits each into its own chunk */
export const packLoaders: Record<Language, () => Promise<{ default: Pack }>> = {
  en: () => import("./locales/en"),
  de: () => import("./locales/de"),
  ar: () => import("./locales/ar"),
  fr: () => import("./locales/fr"),
  es: () => import("./locales/es"),
  ru: () => import("./locales/ru"),
  zh: () => import("./locales/zh"),
};

/**
 * One fetch per key and visit: a success is kept, a failure is forgotten so
 * the next call tries again (a dropped connection must not lose a language).
 */
export function cachedLoad<K, V>(cache: Map<K, Promise<V>>, key: K, load: () => Promise<V>): Promise<V> {
  let value = cache.get(key);
  if (!value) {
    value = load();
    cache.set(key, value);
    value.catch(() => {
      if (cache.get(key) === value) cache.delete(key);
    });
  }
  return value;
}

const loaded = new Map<Language, Promise<Pack>>();
/** The words of one language, fetched once per visit */
export const loadPack = (language: Language): Promise<Pack> =>
  cachedLoad(loaded, language, () => packLoaders[language]().then((module) => module.default));
