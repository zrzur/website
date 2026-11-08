import { render } from "solid-js/web";
import App from "./App";
import "./site.css";
import "./report.css";

// pages built by scripts/prerender.mjs carry their words in plain HTML for
// search engines; the app draws the real page in their place
const root = document.getElementById("root")!;
if (root.hasAttribute("data-prerendered")) {
  root.textContent = "";
  root.removeAttribute("data-prerendered");
}
render(() => <App />, root);
