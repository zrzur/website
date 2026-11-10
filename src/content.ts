import type { Language } from "./i18n";
import type { FeatureId } from "./strings";

export type { Language };
export type { Label, Labels, Pack } from "./strings";
/** Texts that may not exist in every language (the policies): English is the fallback. */
export type Partial = { en: string } & { [L in Language]?: string };
export const localize = (value: Partial, language: Language) =>
  value[language] ?? value.en;

/**
 * The features in page order, without words: each language's file
 * (src/locales/<code>.ts) has the title and line of every feature.
 */
export const features: readonly { id: FeatureId; view: "lobby" | "voice" | "chat" | "settings" | "roles" | "discover" | "light" | "code"; icon: string }[] = [
  { id: "channels", view: "lobby", icon: "hash" },
  { id: "voice", view: "voice", icon: "headphones" },
  { id: "sharing", view: "chat", icon: "image" },
  { id: "roles", view: "settings", icon: "shield" },
  { id: "interests", view: "roles", icon: "users" },
  { id: "discover", view: "discover", icon: "compass" },
  { id: "appearance", view: "light", icon: "palette" },
  { id: "open", view: "code", icon: "code" },
];
