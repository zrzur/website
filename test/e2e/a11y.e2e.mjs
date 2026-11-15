// Accessibility of the built site (ZR-015): axe-core on the main pages in
// en, ar and de, at 1280 px and 375 px, served as zrzur.com serves it
// (static-server.mjs). Serious and critical findings (WCAG 2.0-2.2 A/AA)
// fail. First it proves the check works: a page with an unnamed button and
// an image without alt text must fail.
// Needs the built site: npm run build
// Usage: E2E_PLAYWRIGHT_FROM=<package.json that resolves @playwright/test and axe-core> \
//   [E2E_CHROMIUM=<chrome path>] node --experimental-strip-types test/e2e/a11y.e2e.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { serveDist } from "./static-server.mjs";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test and axe-core");
  process.exit(2);
}
const require = createRequire(from);
const mod = await import(pathToFileURL(require.resolve("@playwright/test")).href);
const { chromium } = mod.default ?? mod;
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const PAGES = ["/", "/download", "/features", "/project", "/guide", "/legal/imprint", "/legal/contact", "/source", "/third-party-notices"];
const LANGUAGES = ["en", "ar", "de"];
const SIZES = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 375, height: 812 },
];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const path = (page, code) => (code === "en" ? page : page === "/" ? `/${code}` : `/${code}${page}`);

/** The serious and critical axe findings of the open page */
async function findings(page) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(
    // the giant name at the foot of the page is decoration (aria-hidden),
    // which WCAG 1.4.3 exempts from contrast
    (tags) => window.axe.run({ exclude: [".footer-word"] }, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations"] }),
    TAGS,
  );
  return result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(", ")}`);
}

const server = await serveDist();
const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM, headless: true });
let passed = 0;
let failed = 0;
try {
  // the check itself: a broken page must fail
  {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><html lang="en"><title>x</title><body><main><button></button><img src="data:,"></main></body></html>');
    const bad = await findings(page);
    await page.close();
    if (bad.some((f) => f.startsWith("button-name")) && bad.some((f) => f.startsWith("image-alt"))) {
      passed++;
      console.log("ok   self-test: an unnamed button and an image without alt fail");
    } else {
      failed++;
      console.error(`FAIL self-test: the broken page was not caught (${JSON.stringify(bad)})`);
    }
  }
  for (const size of SIZES) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, colorScheme: "dark" });
    for (const code of LANGUAGES)
      for (const target of PAGES) {
        const at = path(target, code);
        const page = await context.newPage();
        const response = await page.goto(server.url + at, { waitUntil: "networkidle" });
        const problems = response?.status() === 200 ? await findings(page) : [`status ${response?.status()}`];
        await page.close();
        if (problems.length) {
          failed++;
          console.error(`FAIL ${size.name} ${at}\n  ${problems.join("\n  ")}`);
        } else {
          passed++;
          console.log(`ok   ${size.name} ${at}`);
        }
      }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`a11y: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
