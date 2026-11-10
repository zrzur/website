/**
 * The site rendered to HTML at build time (scripts/prerender.mjs), by the
 * same App the browser runs. The prerendered page is then exactly what the
 * app draws: when the app takes over, every element it puts in place has the
 * size the visitor already saw, so nothing moves and no larger element paints
 * late. Built with `vite build --ssr`; never shipped to the browser.
 */
import { renderToStringAsync } from "solid-js/web";

import App, { pageForPath } from "./App";
import { loadPosts } from "./blog";
import { splitLocale, type Language } from "./i18n";
import { loadPack } from "./strings";

/** The page at `pathname` (e.g. "/fr/features") in `language`, as the HTML inside #root */
export async function renderPage(pathname: string, language: Language): Promise<string> {
  const blog = pageForPath(splitLocale(pathname).path) === "blog";
  const [pack, posts] = await Promise.all([loadPack(language), blog ? loadPosts(language) : Promise.resolve([])]);
  return renderToStringAsync(() => <App language={language} pack={pack} posts={posts} />);
}
