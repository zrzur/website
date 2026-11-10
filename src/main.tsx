import { hydrate, render } from "solid-js/web";
import App, { pageForPath } from "./App";
import { loadPosts, type Post } from "./blog";
import { detectLanguage, readSavedLanguage, splitLocale, type Language } from "./i18n";
import { loadPack, type Pack } from "./strings";
import "./site.css";
import "./report.css";

/**
 * The words of this visit's language (the page preloads them). A failed
 * fetch is tried once more, then English is used; if even that fails the
 * prerendered page stays as it is: it is the whole page, only without its
 * menus and motion.
 */
async function firstWords(language: Language, blog: boolean): Promise<{ language: Language; pack: Pack; posts: Post[] } | null> {
  const attempt = async (code: Language) => {
    const [pack, posts] = await Promise.all([loadPack(code), blog ? loadPosts(code) : Promise.resolve([])]);
    return { language: code, pack, posts };
  };
  for (const code of language === "en" ? (["en", "en"] as const) : ([language, language, "en"] as const)) {
    try {
      return await attempt(code);
    } catch {
      /* next try */
    }
  }
  return null;
}

/**
 * After the browser has painted what it has. Taking the page over is a long
 * task on a slow phone: done first, it would hold back the first paint of a
 * page that is already complete in the HTML.
 */
const afterPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

/** "/fr/features.html", "/fr/features/" → "/fr/features" */
const clean = (path: string) => path.replace(/\.html$/, "").replace(/(.)\/$/, "$1");

const urlPath = splitLocale(location.pathname).path;
const language = detectLanguage(location.pathname, readSavedLanguage(), navigator.languages ?? []);
const page = pageForPath(urlPath);
const [words] = await Promise.all([firstWords(language, page === "blog"), afterPaint()]);

const root = document.getElementById("root")!;
const prerendered = root.getAttribute("data-prerendered");
if (!words) document.documentElement.dataset.wordsFailed = "";
else {
  const app = () => <App language={words.language} pack={words.pack} posts={words.posts} />;
  // scripts/prerender.mjs drew this very page with the app at build time: the
  // app takes those nodes over instead of drawing new ones, so nothing on
  // screen is replaced or moves. Drawn afresh: another page (the /index.html
  // fallback of an unknown address), another language (a saved choice on the
  // English address), or the report form (its words load in the browser).
  const same =
    prerendered !== null &&
    clean(prerendered) === clean(location.pathname) &&
    words.language === (splitLocale(location.pathname).language ?? "en") &&
    page !== "report";
  root.removeAttribute("data-prerendered");
  if (same) {
    // what Solid's inline hydration script would set up; the page policy
    // allows no inline script, and there is no server data to pick up
    const shared = globalThis as { _$HY?: object };
    shared._$HY ??= { events: [], completed: new WeakSet(), r: {}, fe() {} };
    hydrate(app, root);
  } else {
    root.textContent = "";
    render(app, root);
  }
}
