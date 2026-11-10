// The built site under the production page policy: every page loads in
// every site language (ar/en/de/fr/es/ru/zh), at 1280 px and 375 px, with no Content-Security-Policy violation,
// the theme script runs (dark theme, right direction) and the report page
// opens. First it proves the listener works: an inline script is refused.
// Serves dist/ itself (static-server.mjs: Caddy's try_files and 404 pages) with the policy of the zrzur.com block in
// self-hosted/production/Caddyfile (POLICY below; keep the two the same).
// Needs the built site: npm run build
// Usage: E2E_PLAYWRIGHT_FROM=<package.json> E2E_CHROMIUM=<chrome path> \
//   node test/e2e/csp.e2e.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { serveDist } from "./static-server.mjs";

export const POLICY =
  "default-src 'self'; script-src 'self' https://hcaptcha.com https://*.hcaptcha.com; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.zrzur.com https://hcaptcha.com https://*.hcaptcha.com; frame-src https://hcaptcha.com https://*.hcaptcha.com; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test");
  process.exit(2);
}
const mod = await import(pathToFileURL(createRequire(from).resolve("@playwright/test")).href);
const { chromium } = mod.default ?? mod;

// served as zrzur.com serves it, 404 pages included (static-server.mjs)
const server = await serveDist(() => ({
  // a local build's report form talks to the local API instead
  "content-security-policy": POLICY.replace("connect-src 'self'", "connect-src 'self' http://127.0.0.1:14702"),
}));
const site = server.url;

let failed = 0;
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name} ${detail}`);
  }
}

const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM, headless: true });

async function open(path, viewport, locale = "en-US") {
  // the visitor's browser language matches the page's
  const context = await browser.newContext({ viewport, locale });
  await context.addInitScript(() => {
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  const page = await context.newPage();
  const refused = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) refused.push(m.text());
  });
  await page.goto(`${site}${path}`, { waitUntil: "networkidle" });
  return { context, page, refused };
}

{
  const { context, page } = await open("/", { width: 1280, height: 800 });
  const ran = await page.evaluate(async () => {
    const script = document.createElement("script");
    script.textContent = "window.__ran = true";
    document.head.appendChild(script);
    await new Promise((r) => setTimeout(r, 200));
    return window.__ran === true;
  });
  const found = await page.evaluate(() => window.__csp);
  check("an inline script is refused and reported", !ran && found.some((v) => v.startsWith("script-src")));
  await context.close();
}

const pages = ["/", "/features", "/download", "/about", "/developers", "/report", "/legal/privacy", "/blog/why-zrzur"];
const TAGS = { en: "en", ar: "ar", de: "de", fr: "fr", es: "es", ru: "ru", zh: "zh-Hans" };
const BROWSER = { en: "en-US", ar: "ar", de: "de-DE", fr: "fr-FR", es: "es-ES", ru: "ru-RU", zh: "zh-CN" };
for (const viewport of [
  { width: 1280, height: 800 },
  { width: 375, height: 812 },
]) {
  for (const language of Object.keys(TAGS)) {
    for (const base of pages) {
      const path = language === "en" ? base : `/${language}${base === "/" ? "/" : base}`;
      const { context, page, refused } = await open(path, viewport, BROWSER[language]);
      const found = [...(await page.evaluate(() => window.__csp)), ...refused];
      const root = await page.evaluate(() => ({
        theme: document.documentElement.dataset.theme,
        dir: document.documentElement.dir,
        lang: document.documentElement.lang,
      }));
      const ok =
        found.length === 0 &&
        root.theme === "dark" &&
        root.lang === TAGS[language] &&
        root.dir === (language === "ar" ? "rtl" : "ltr");
      check(`${viewport.width}px ${path}`, ok, `${JSON.stringify(root)} ${found.slice(0, 3).join(" | ")}`);
      await context.close();
    }
  }
}

await browser.close();
server.close();
console.log(`csp: ${passed} passed, ${failed} failed, ${passed + failed} tests`);
process.exit(failed || !passed ? 1 : 0);
