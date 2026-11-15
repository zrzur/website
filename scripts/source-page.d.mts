import type { Plugin } from "vite";

export type SourceRow = { key: string; repo: string; version: string; commit: string };

export type SourcePage = {
  file: string;
  lang: string;
  dir: string;
  labels: Record<string, string>;
  backHref: string;
};

export function sourceRows(
  website: { version: string; commit: string },
  releases: Record<"web" | "backend" | "desktop", { repo: string; version: string; commit: string }>,
): SourceRow[];
export function renderSourcePage(page: SourcePage, rows: SourceRow[]): string;
export function sourcePages(
  locales: readonly { code: string; tag: string; dir: string }[],
  labelsOf: (code: string) => Record<string, string>,
): SourcePage[];
export function sourcePagesPlugin(pages: SourcePage[], rowsOf: () => SourceRow[]): Plugin;
