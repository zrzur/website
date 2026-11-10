import { render } from "solid-js/web";
import App, { pageForPath } from "./App";
import { loadPosts } from "./blog";
import { detectLanguage, readSavedLanguage, splitLocale } from "./i18n";
import { loadPack } from "./strings";
import "./site.css";
import "./report.css";

// the words of this visit's language come first (the prerendered page
// preloads them); until they arrive the prerendered HTML stays on screen
const language = detectLanguage(location.pathname, readSavedLanguage(), navigator.languages ?? []);
const blog = pageForPath(splitLocale(location.pathname).path) === "blog";
const [pack, posts] = await Promise.all([loadPack(language), blog ? loadPosts(language) : Promise.resolve([])]);

// pages built by scripts/prerender.mjs carry their words in plain HTML for
// search engines; the app draws the real page in their place
const root = document.getElementById("root")!;
if (root.hasAttribute("data-prerendered")) {
  root.textContent = "";
  root.removeAttribute("data-prerendered");
}
render(() => <App language={language} pack={pack} posts={posts} />, root);
