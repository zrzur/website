import { hydrate, render, runHydrationEvents } from "solid-js/web";
import App, { pageForPath, preparePage } from "./App";
import { loadPosts, type Post } from "./blog";
import { detectLanguage, readSavedLanguage, splitLocale, type Language } from "./i18n";
import { loadPack, type Pack } from "./strings";
import "./site.css";
import "./report.css";

/**
 * The words of this visit's language (the page preloads them), tried twice.
 * On an address with a language in it the page is already that language's
 * page: if its words do not come, the built page stays as it is (readable,
 * only without menus and motion), never an English page in its place. Only
 * on an English address, when theme.js could not send the visitor to their
 * own address, is English the last try.
 */
async function firstWords(language: Language, urlLanguage: Language | null, blog: boolean) {
  const attempt = async (code: Language) => {
    const [pack, posts] = await Promise.all([loadPack(code), blog ? loadPosts(code) : Promise.resolve([] as Post[])]);
    return { language: code, pack, posts };
  };
  const tries: Language[] = [language, language];
  if (!urlLanguage && language !== "en") tries.push("en");
  for (const code of tries) {
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

const { language: urlLanguage, path } = splitLocale(location.pathname);
const language = detectLanguage(location.pathname, readSavedLanguage(), navigator.languages ?? []);
const page = pageForPath(path);
const root = document.getElementById("root")!;
const prerendered = root.getAttribute("data-prerendered");
const [words, prepared] = await Promise.all([
  firstWords(language, urlLanguage, page === "blog"),
  // a page whose code or words did not come is drawn afresh, with its own retry
  preparePage(page, language).then(
    () => true,
    () => false,
  ),
  afterPaint(),
]);

const marks = document.documentElement.dataset;
if (!words) marks.wordsFailed = "";
else {
  const app = () => <App language={words.language} pack={words.pack} posts={words.posts} />;
  // scripts/prerender.mjs drew this very page with the app at build time:
  // the app takes those nodes over instead of drawing new ones, so nothing on
  // screen is replaced or moves. Drawn afresh: another page (the 404 page
  // for an unknown address) or another language than the built one.
  const built = prerendered === "404" ? page === "404" : prerendered !== null && clean(prerendered) === clean(location.pathname);
  const same = built && prepared && words.language === (urlLanguage ?? "en");
  root.removeAttribute("data-prerendered");
  if (same) {
    // theme.js set this up to keep early taps; without it (blocked), an empty one
    (globalThis as { _$HY?: object })._$HY ??= { events: [], completed: new WeakSet(), r: {}, fe() {} };
    hydrate(app, root);
    // the taps theme.js kept, now on the live page
    runHydrationEvents();
  }
  else {
    // nothing to take over: theme.js stops keeping taps for a replay
    const kept = (globalThis as { _$HY?: { events: unknown } })._$HY;
    if (kept) kept.events = null;
    root.textContent = "";
    render(app, root);
  }
  // for tests and support: how the page came to life
  marks.takeover = same ? "hydrate" : "render";
  performance.mark("zrzur-interactive");
}
