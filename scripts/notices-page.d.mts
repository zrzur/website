import type { Plugin } from "vite";

export type NoticesPage = {
  file: string;
  lang: string;
  dir: string;
  title: string;
  intro: string;
  back: string;
  backHref: string;
  plain: string;
  brand: string;
};

export type NoticesLabels = {
  thirdParty: string;
  thirdPartyIntro: string;
  thirdPartyPlain: string;
  home: string;
  brand: string;
};

export function renderNoticesPage(page: NoticesPage, text: string): string;
export function noticesPages(
  locales: readonly { code: string; tag: string; dir: string }[],
  labelsOf: (code: string) => NoticesLabels,
): NoticesPage[];
export function noticesPagesPlugin(pages: NoticesPage[]): Plugin;
