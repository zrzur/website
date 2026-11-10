// An unknown address, served as zrzur.com serves it (static-server.mjs, the
// self-hosted Caddyfile): status 404 with the 404 page of the address's
// language, not indexed, no canonical or og:url, its links work, the app
// takes the page over as built and nothing reports an error.
// Needs the built site: npm run build
// Usage: E2E_PLAYWRIGHT_FROM=<package.json> [E2E_CHROMIUM=<chrome>] \
//   node --experimental-strip-types test/e2e/not-found.e2e.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { serveDist } from "./static-server.mjs";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test");
  process.exit(2);
}
const mod = await import(pathToFileURL(createRequire(from).resolve("@playwright/test")).href);
const { chromium } = mod.default ?? mod;
const { LOCALES } = await import("../../src/i18n.ts");
const tag = (code) => LOCALES.find((l) => l.code === code).tag;
const packs = Object.fromEntries(
  await Promise.all(LOCALES.map(async ({ code }) => [code, (await import(`../../src/locales/${code}.ts`)).default])),
);

let failed = 0;
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed++;
  else {
    failed++;
    console.log(`FAIL ${name} ${detail}`);
  }
}

const server = await serveDist();
const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM || undefined });
const home = (code) => (code === "en" ? "/" : `/${code}/`);
for (const code of ["en", "ar", "de", "fr", "es", "ru", "zh"])
  for (const width of [1280, 375]) {
    const path = code === "en" ? "/no-such-page" : `/${code}/no-such-page`;
    const where = `${code} ${width} ${path}`;
    const context = await browser.newContext({ viewport: { width, height: width < 700 ? 812 : 800 }, locale: tag(code) });
    // the visitor's own language, so theme.js does not send them elsewhere
    await context.addInitScript((language) => localStorage.setItem("zrzur-site-language", language), code);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => message.type() === "error" && !/404 \(Not Found\)/.test(message.text()) && errors.push(message.text()));
    const response = await page.goto(server.url + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    check(`${where} status 404`, response.status() === 404, String(response.status()));
    check(`${where} lang`, (await page.getAttribute("html", "lang")) === tag(code));
    check(`${where} not indexed`, (await page.locator('meta[name="robots"][content="noindex"]').count()) === 1);
    check(`${where} no canonical`, (await page.locator('link[rel="canonical"]').count()) === 0);
    check(`${where} no og:url`, (await page.locator('meta[property="og:url"]').count()) === 0);
    check(`${where} the 404 page`, (await page.locator("h1").textContent())?.trim() === packs[code].labels.notFound);
    check(`${where} taken over as built`, (await page.getAttribute("html", "data-takeover")) === "hydrate");
    check(`${where} no errors`, errors.length === 0, errors.join(" | "));
    // the visitor takes the way back home
    await page.locator(".not-found .button-primary").click();
    await page.waitForURL((url) => url.pathname === home(code));
    check(`${where} back home`, (await page.locator("h1").textContent())?.trim() === packs[code].labels.heroTitle);
    await context.close();
  }
// a crafted address never sends the visitor to another site (theme.js redirects)
for (const locale of ["en-US", "de-DE"])
  for (const path of ["/en//evil.com", "/en/%5Cevil.com", "/en/%5C/evil.com", "/EN//evil.com"]) {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    const left = [];
    page.on("request", (request) => new URL(request.url()).origin !== server.url && left.push(request.url()));
    await page.goto(server.url + path, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(300);
    const at = new URL(page.url());
    check(`${locale} ${path} stays on the site`, at.origin === server.url && left.length === 0, `${page.url()} ${left.join(", ")}`);
    check(`${locale} ${path} no doubled slash`, !/^\/{2}|^\/[a-z]{2}\/{2}/.test(at.pathname), at.pathname);
    await context.close();
  }
// known addresses keep status 200, and a file never falls back to the home page
for (const path of ["/", "/features", "/de/features", "/fr/legal/privacy", "/zh/"]) {
  const response = await fetch(server.url + path);
  check(`${path} status 200`, response.status === 200, String(response.status));
}
check("an unknown file is a 404", (await fetch(server.url + "/assets/no-such.js")).status === 404);
await browser.close();
server.close();
console.log(`not-found: ${passed} passed, ${failed} failed`);
process.exit(failed || !passed ? 1 : 0);
