/**
 * Version, commit and tag of this build, injected by Vite (`define` in
 * vite.config.ts, from scripts/release-info.mjs). The "source code" link
 * points at the exact source of the running build (AGPL section 13).
 */
export interface BuildInfo {
  version: string;
  commit: string;
  tag: string;
  repo: string;
  sourceUrl: string;
}

declare const __ZRZUR_BUILD__: BuildInfo | undefined;

const FALLBACK: BuildInfo = {
  version: "dev",
  commit: "",
  tag: "",
  repo: "website",
  sourceUrl: "https://github.com/zrzur/website",
};

export const buildInfo: BuildInfo =
  typeof __ZRZUR_BUILD__ !== "undefined" && __ZRZUR_BUILD__ ? __ZRZUR_BUILD__ : FALLBACK;

export const SOURCE_URL = buildInfo.sourceUrl;

/** Licence texts of everything bundled in this build (L-08) */
export const THIRD_PARTY_NOTICES_PATH = "THIRD-PARTY-NOTICES.txt";
