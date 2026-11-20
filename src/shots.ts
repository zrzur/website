/**
 * The app screens on the site: the owner's own screenshots of the running
 * app (26.2.0), one per slot and language, made into page sizes by
 * scripts/site-shots.py (AVIF and WebP, several widths, no metadata). Arabic
 * pages show the Arabic shots, every other language the English ones. A slot
 * without its shot yet shows a marked, empty frame of the same size, so the
 * page never jumps when the picture arrives.
 * Shared by the app (Slot) and the build (the first picture's preload, read by
 * public/theme.js).
 */
import { SHOTS, type ShotEntry } from "./shot-manifest.ts";

export type SlotId = "d1" | "d2" | "d4" | "d5" | "d6" | "d7" | "d8" | "m1" | "m2" | "m3" | "m4" | "m5" | "m6";
export type ShotLanguage = "ar" | "en" | "de";
export type Slot = {
  phone: boolean;
  /** the label key of the picture's alt text */
  alt: `shot${Uppercase<SlotId>}Alt`;
  /** what to capture, shown in the empty frame (internal/assets/website-26.2.0/SHOT-LIST.md) */
  note: { ar: string; en: string };
};

/** Every place on the site that shows an app screen */
export const SLOTS: Record<SlotId, Slot> = {
  d1: { phone: false, alt: "shotD1Alt", note: { ar: "Zrzur Lounge ← قناة announcements", en: "Zrzur Lounge → announcements" } },
  d2: { phone: false, alt: "shotD2Alt", note: { ar: "Zrzur Lounge ← الردهة", en: "Zrzur Lounge → Lobby" } },
  d4: { phone: false, alt: "shotD4Alt", note: { ar: "Zrzur Discover", en: "Zrzur Discover" } },
  d5: { phone: false, alt: "shotD5Alt", note: { ar: "Zrzur Designs", en: "Zrzur Designs" } },
  d6: { phone: false, alt: "shotD6Alt", note: { ar: "البروفايل الكامل", en: "Full profile" } },
  d7: { phone: false, alt: "shotD7Alt", note: { ar: "الإعدادات ← المظهر", en: "Settings → Appearance" } },
  d8: { phone: false, alt: "shotD8Alt", note: { ar: "الفعاليات (بعد beta.3)", en: "Events (after beta.3)" } },
  m1: { phone: true, alt: "shotM1Alt", note: { ar: "قائمة القنوات", en: "Channel list" } },
  m2: { phone: true, alt: "shotM2Alt", note: { ar: "قناة announcements", en: "announcements" } },
  m3: { phone: true, alt: "shotM3Alt", note: { ar: "الردهة", en: "Lobby" } },
  m4: { phone: true, alt: "shotM4Alt", note: { ar: "Discover", en: "Discover" } },
  m5: { phone: true, alt: "shotM5Alt", note: { ar: "البروفايل", en: "Profile" } },
  m6: { phone: true, alt: "shotM6Alt", note: { ar: "الفعاليات", en: "Events" } },
};

/** The size of an empty frame: a 1440 x 900 window, an iPhone screen */
export const EMPTY_SIZE = { desktop: { w: 1440, h: 900 }, phone: { w: 1179, h: 2556 } } as const;

/** Most pictures sit in half the page on larger screens */
export const DEFAULT_SIZES = "(max-width: 900px) calc(100vw - 32px), 50vw";
/** The first picture of the home page spans the page */
export const HERO_SIZES = "(max-width: 1392px) calc(100vw - 32px), 1360px";
/** A phone screen is drawn about 280 px wide */
export const PHONE_SIZES = "(max-width: 600px) 62vw, 280px";

export const shotLanguageOf = (language: string): ShotLanguage => (language === "ar" || language === "de" ? language : "en");

/**
 * The shot a slot shows in a language: its own (German only where the owner
 * took one), else English, else Arabic. `exact`: that language or nothing,
 * for the phones that show one screen in three languages.
 */
export function shotFor(shots: Record<string, ShotEntry>, id: SlotId, language: string, exact = false): { language: ShotLanguage; entry: ShotEntry } | null {
  const own = shotLanguageOf(language);
  const order: ShotLanguage[] = exact ? [own] : [own, "en", "ar"];
  for (const code of order) {
    const entry = shots[`${code}-${id}`];
    if (entry) return { language: code, entry };
  }
  return null;
}

/** The files of one shot: AVIF first, WebP for the rest; each address carries its content hash */
export function shotFiles(id: SlotId, code: ShotLanguage, entry: ShotEntry, sizes: string) {
  const at = (width: number, ext: string) => `/assets/shots/${code}-${id}-${width}.${ext}?v=${entry.v}`;
  const set = (ext: string) => entry.widths.map((width) => `${at(width, ext)} ${width}w`).join(", ");
  return { avif: set("avif"), webp: set("webp"), src: at(entry.widths[entry.widths.length - 1], "webp"), sizes, width: entry.w, height: entry.h };
}

/** What public/theme.js preloads for the home page's first picture (the same in both shades) */
export function heroPreload(shots: Record<string, ShotEntry>, language: string) {
  const found = shotFor(shots, "d1", language);
  if (!found) return null;
  const files = shotFiles("d1", found.language, found.entry, HERO_SIZES);
  const entry = [{ type: "image/avif", srcset: files.avif, sizes: files.sizes }];
  return { dark: entry, light: entry };
}

export { SHOTS };
