// The site in French, Spanish, Russian and Simplified Chinese, as a visitor
// uses it, at 1280 px and 375 px: every page opens in its language with the
// right lang and direction, nothing scrolls sideways, no text or control sits
// closer than 12 px to the edge of its box, the page fetches only its own
// language's words and fonts; the language menu switches and remembers; the
// browser language picks the first page; policy translations name the
// binding English/German versions and link to them.
// Needs the built site: npm run build && npx vite preview --port 14931
// Usage: E2E_SITE=http://127.0.0.1:14931 E2E_PLAYWRIGHT_FROM=<package.json> \
//   [E2E_LANGUAGES=fr,es,ru,zh] [E2E_SHOTS=<dir>] \
//   node --experimental-strip-types test/e2e/site-languages.e2e.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test");
  process.exit(2);
}
const mod = await import(pathToFileURL(createRequire(from).resolve("@playwright/test")).href);
const { chromium } = mod.default ?? mod;
const site = process.env.E2E_SITE ?? "http://127.0.0.1:14931";
const shots = process.env.E2E_SHOTS;
const { LOCALES } = await import("../../src/i18n.ts");
const packs = Object.fromEntries(
  await Promise.all(LOCALES.map(async ({ code }) => [code, (await import(`../../src/locales/${code}.ts`)).default])),
);
const tag = (code) => LOCALES.find((l) => l.code === code).tag;
/** the pages of every site language go through the page checks */
const languages = (process.env.E2E_LANGUAGES ?? "en,de,ar,fr,es,ru,zh").split(",");
/** the four languages added on 2026-11-10: menu, browser and policy checks */
const NEW = ["fr", "es", "ru", "zh"].filter((code) => languages.includes(code));
const pathOf = (language, path = "/") => (language === "en" ? path : `/${language}${path === "/" ? "/" : path}`);
const PAGES = ["/", "/features", "/project", "/download", "/guide", "/blog", "/blog/why-zrzur", "/legal", "/legal/privacy", "/legal/terms", "/report", "/no-such-page"];

let failed = 0;
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed++;
  else {
    failed++;
    console.log(`FAIL ${name} ${detail}`);
  }
}

/** Runs in the page: text or a control closer than `min` px to the border of its box */
const tooClose = (min) => {
  const shown = (el) => {
    const style = getComputedStyle(el);
    if (!el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) return false;
    return style.display !== "none";
  };
  const transparent = (color) => color === "transparent" || /rgba?\(.*,\s*0\)$/.test(color) || color.endsWith(" / 0)");
  /** a box: a panel with a visible border or its own fill, rounded, big enough to hold text */
  const isBox = (el) => {
    if (el.matches("button, a, input, textarea, img, picture, figure, canvas, svg, video, summary, code, pre, span, strong, em, label, li, html, body, main, header, footer, nav, section")) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (rect.width < 120 || rect.height < 48) return false;
    if (parseFloat(style.borderTopLeftRadius) < 8) return false;
    const border = parseFloat(style.borderTopWidth) > 0 && !transparent(style.borderTopColor);
    const fill = !transparent(style.backgroundColor) || style.backgroundImage !== "none";
    return border || fill;
  };
  const found = [];
  for (const box of [...document.querySelectorAll("#main *, .site-footer *, dialog[open] *")].filter(isBox)) {
    if (!shown(box) || box.closest("[aria-hidden='true']")) continue;
    const edge = box.getBoundingClientRect();
    const near = (rect, name) => {
      if (rect.width < 1 || rect.height < 1) return;
      const gaps = { left: rect.left - edge.left, right: edge.right - rect.right, top: rect.top - edge.top, bottom: edge.bottom - rect.bottom };
      // only what is inside the box: a picture that bleeds out on purpose is not text in a box
      if (Object.values(gaps).some((gap) => gap < -1)) return;
      const close = Object.entries(gaps).filter(([, gap]) => gap < min - 0.5);
      if (close.length) found.push(`${box.className || box.tagName} › ${name.slice(0, 32)} ${close.map(([side, gap]) => `${side} ${gap.toFixed(1)}`).join(" ")}`);
    };
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!node.textContent.trim() || !parent || !shown(parent) || parent.closest("[aria-hidden='true']")) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      near(range.getBoundingClientRect(), node.textContent.trim());
    }
  }
  return [...new Set(found)];
};

const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM || undefined });

// 1. every page of every language, on a desktop and on a 375 px phone
for (const width of [1280, 375])
  for (const language of languages) {
    const context = await browser.newContext({ viewport: { width, height: width < 700 ? 812 : 800 }, locale: tag(language) });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const scripts = new Map();
    const fonts = new Set();
    page.on("response", async (response) => {
      const type = response.request().resourceType();
      if (type === "font") fonts.add(new URL(response.url()).pathname.split("/").pop());
      if (type === "script") scripts.set(response.url(), await response.text().catch(() => ""));
    });
    for (const path of PAGES) {
      const where = `${language} ${width} ${path}`;
      await page.goto(site + pathOf(language, path), { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      check(`${where} lang`, (await page.getAttribute("html", "lang")) === tag(language), await page.getAttribute("html", "lang"));
      check(`${where} direction`, (await page.getAttribute("html", "dir")) === LOCALES.find((l) => l.code === language).dir);
      check(`${where} one h1`, (await page.locator("h1").count()) === 1);
      check(`${where} no native select`, (await page.locator("select").count()) === 0);
      const footer = (await page.locator(".footer-column h2").first().textContent())?.trim();
      check(`${where} footer in its language`, footer === packs[language].labels.footerProduct, footer);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`${where} no sideways scroll`, over <= 0, `${over}px`);
      // the boxes as a visitor scrolls past them (the entrance motion is done)
      await page.evaluate(() => document.querySelectorAll("[data-rise]").forEach((el) => el.classList.add("is-in")));
      await page.waitForTimeout(700);
      const close = await page.evaluate(tooClose, 12);
      check(`${where} 12 px inside every box`, close.length === 0, close.slice(0, 6).join(" | "));
      if (shots) await page.screenshot({ path: `${shots}/${language}-${width}${path.replace(/\//g, "_") || "_"}.png`, fullPage: true });
    }
    // the prerendered page, before any script: the same layout rules hold
    const bare = await browser.newContext({ viewport: { width, height: width < 700 ? 812 : 800 }, javaScriptEnabled: false });
    const still = await bare.newPage();
    for (const path of ["/", "/features", "/guide", "/legal/privacy", "/report", "/blog/why-zrzur"]) {
      const where = `${language} ${width} ${path} prerendered`;
      await still.goto(site + pathOf(language, path), { waitUntil: "load" });
      check(`${where} has its page`, (await still.locator("#root[data-prerendered] h1").count()) === 1);
      check(`${where} lang`, (await still.getAttribute("html", "lang")) === tag(language));
      const over = await still.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`${where} no sideways scroll`, over <= 0, `${over}px`);
      const close = await still.evaluate(tooClose, 12);
      check(`${where} 12 px inside every box`, close.length === 0, close.slice(0, 6).join(" | "));
    }
    await bare.close();
    // the words of the other languages never came down
    const others = LOCALES.filter((l) => l.code !== language).map((l) => l.code);
    for (const other of others) {
      const marker = packs[other].labels.heroTitle;
      const leaked = [...scripts].filter(([, body]) => body.includes(JSON.stringify(marker).slice(1, -1))).map(([url]) => url.split("/").pop());
      check(`${language} ${width} has no ${other} words`, leaked.length === 0, leaked.join(", "));
    }
    const cyrillic = [...fonts].some((name) => name.includes("cyrillic"));
    check(`${language} ${width} Cyrillic font only for Russian`, cyrillic === (language === "ru"), [...fonts].join(", "));
    check(`${language} ${width} no Chinese font file`, ![...fonts].some((name) => /cjk|han|sc|zh/i.test(name)), [...fonts].join(", "));
    check(`${language} ${width} no page errors`, errors.length === 0, errors.join(" | "));
    await context.close();
  }

// 2. Latin and Arabic pages fetch no Cyrillic font, even with the language menu open
for (const language of ["en", "ar", "de"]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: language });
  const page = await context.newPage();
  const fonts = new Set();
  page.on("response", (response) => {
    if (response.request().resourceType() === "font") fonts.add(new URL(response.url()).pathname.split("/").pop());
  });
  await page.goto(site + pathOf(language, "/"), { waitUntil: "networkidle" });
  await page.locator("#footer-language .language-button, .footer-controls .language-button").first().click();
  await page.locator("#footer-language-list").waitFor();
  await page.waitForTimeout(600);
  check(`${language} page fetches no Cyrillic font`, ![...fonts].some((name) => name.includes("cyrillic")), [...fonts].join(", "));
  await context.close();
}

// 3. the language menu: a visitor picks a language, the page follows, the choice stays
for (const width of [1280, 375]) {
  const context = await browser.newContext({ viewport: { width, height: width < 700 ? 812 : 800 }, locale: "en-US" });
  const page = await context.newPage();
  await page.goto(site + "/features", { waitUntil: "networkidle" });
  for (const language of NEW) {
    const button = page.locator(".footer-controls .language-button");
    await button.scrollIntoViewIfNeeded();
    await button.click();
    // in the page: from the press on the language to the page in that language
    await page.evaluate(() => {
      window.__switch = null;
      const start = { at: 0 };
      document.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".language-option")) start.at = performance.now();
      }, { capture: true, once: true });
      new MutationObserver((_, observer) => {
        window.__switch = performance.now() - start.at;
        observer.disconnect();
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    });
    await page.locator(`#footer-language-${language}`).click();
    await page.waitForFunction((code) => document.documentElement.lang === code, tag(language));
    const ms = Math.round(await page.evaluate(() => window.__switch));
    check(`menu ${width} → ${language} under 100 ms`, ms < 100, `${ms} ms`);
    check(`menu ${width} → ${language} address`, new URL(page.url()).pathname === pathOf(language, "/features"), page.url());
    check(`menu ${width} → ${language} heading`, (await page.locator("h1").textContent()).replace(/\s+/g, " ").trim() === packs[language].labels.featuresTitle.replace(/\s+/g, " "));
    check(`menu ${width} → ${language} hreflang`, (await page.locator(`link[rel=alternate][hreflang="${tag(language)}"]`).count()) === 1);
    console.log(`switch to ${language} at ${width}px: ${ms} ms (press to page in that language)`);
  }
  // remembered: the root address opens in the last choice
  const last = NEW.at(-1);
  await page.goto(site + "/", { waitUntil: "networkidle" });
  check(`menu ${width} remembered`, new URL(page.url()).pathname === pathOf(last, "/"), page.url());
  await page.reload({ waitUntil: "networkidle" });
  check(`menu ${width} remembered after reload`, (await page.getAttribute("html", "lang")) === tag(last));
  // keyboard: Enter opens, End goes to the last language, Enter picks it
  await page.goto(site + pathOf(last, "/guide"), { waitUntil: "networkidle" });
  await page.locator(".footer-controls .language-button").focus();
  await page.keyboard.press("Enter");
  await page.locator("#footer-language-list").waitFor();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.documentElement.lang === "en");
  check(`menu ${width} keyboard back to English`, new URL(page.url()).pathname === "/guide", page.url());
  await context.close();
}

// 4. the browser's language decides the first visit; traditional Chinese stays English
for (const [locale, expected] of [["fr-FR", "fr"], ["es-MX", "es"], ["ru-RU", "ru"], ["zh-CN", "zh"], ["zh-TW", "en"], ["it-IT", "en"]]) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, locale });
  const page = await context.newPage();
  await page.goto(site + "/download", { waitUntil: "networkidle" });
  check(`browser ${locale} opens ${expected}`, new URL(page.url()).pathname === pathOf(expected, "/download"), page.url());
  check(`browser ${locale} lang`, (await page.getAttribute("html", "lang")) === tag(expected));
  await context.close();
}

// 5. policies: a translation names the binding versions and links to them
{
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "fr-FR" });
  const page = await context.newPage();
  for (const language of NEW) {
    await page.goto(site + pathOf(language, "/legal/privacy"), { waitUntil: "networkidle" });
    // the English text under this prefix is not a page of its own (review 2026-11-10)
    check(`${language} privacy canonical is English`, (await page.locator('link[rel="canonical"]').getAttribute("href")) === "https://zrzur.com/legal/privacy");
    check(`${language} privacy is in no hreflang set`, (await page.locator(`link[rel=alternate][hreflang="${tag(language)}"]`).count()) === 0);
    const note = page.locator("#legal-binding");
    check(`${language} privacy binding note`, await note.isVisible());
    const text = await note.textContent();
    check(`${language} privacy names English and German`, text.includes(packs[language].labels.legalBindingEnDe), text);
    check(`${language} privacy says it shows English`, text.includes(packs[language].labels.legalEnglishNote), text);
    check(`${language} privacy text is marked English`, (await page.locator(".legal-content [lang=en]").count()) > 0);
    check(`${language} links German`, (await note.locator("a[data-binding=de]").getAttribute("href")) === "/de/legal/privacy");
  }
  // the reader follows the link to the German version: that page is binding, no note
  await page.goto(site + "/es/legal/privacy", { waitUntil: "networkidle" });
  await page.locator("#legal-binding a[data-binding=de]").click();
  await page.waitForURL(/\/de\/legal\/privacy$/);
  await page.waitForFunction(() => document.documentElement.lang === "de");
  check("German privacy has no binding note", (await page.locator("#legal-binding").count()) === 0);
  // Arabic is a translation of a policy: it says so and links both binding versions
  await page.goto(site + "/ar/legal/privacy", { waitUntil: "networkidle" });
  const ar = await page.locator("#legal-binding").textContent();
  check("Arabic privacy is a marked translation", ar.includes(packs.ar.labels.legalTranslationNote) && ar.includes(packs.ar.labels.legalBindingEnDe), ar);
  check("Arabic privacy links English and German", (await page.locator("#legal-binding a[data-binding]").count()) === 2);
  // German terms (no German text yet): English is shown and binding
  await page.goto(site + "/de/legal/terms", { waitUntil: "networkidle" });
  const de = await page.locator("#legal-binding").textContent();
  check("German terms say English binds", de.includes(packs.de.labels.legalBindingEn), de);
  await page.goto(site + "/legal/privacy", { waitUntil: "networkidle" });
  check("English privacy has no binding note", (await page.locator("#legal-binding").count()) === 0);
  await page.goto(site + "/zh/legal", { waitUntil: "networkidle" });
  check("Chinese policy list names the binding languages", (await page.locator("#legal-binding").textContent()).includes(packs.zh.labels.legalHubNote));
  await context.close();
}

// 6. when the network fails: a late language never overrides a newer choice,
// a failed first load is tried again, the report form offers a retry
const wordsChunk = async (page, code) =>
  (await page.locator('meta[name="zrzur-words"]').getAttribute("content")).match(new RegExp(`(?:^|,)${code}=([^,]+)`))[1];
{
  // a slow French then a quick Spanish: the page ends in Spanish
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: "en-US" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(site + "/features", { waitUntil: "networkidle" });
  const fr = await wordsChunk(page, "fr");
  await page.route(`**${fr}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  await page.locator(".footer-controls .language-button").click();
  await page.locator("#footer-language-fr").click();
  await page.locator(".footer-controls .language-button").click();
  await page.locator("#footer-language-es").click();
  await page.waitForFunction(() => document.documentElement.lang === "es");
  await page.waitForTimeout(2500);
  check("late French does not override Spanish", (await page.getAttribute("html", "lang")) === "es" && new URL(page.url()).pathname === "/es/features", page.url());
  check("late French: heading in Spanish", (await page.locator("h1").textContent()).replace(/\s+/g, " ").trim() === packs.es.labels.featuresTitle.replace(/\s+/g, " "));
  check("late French: no page errors", errors.length === 0, errors.join(" | "));
  await context.close();
}
{
  // the first fetch of the page's words fails once: the page still opens in its language
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "fr-FR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const probe = await browser.newPage();
  await probe.goto(site + "/fr/features", { waitUntil: "load" });
  const fr = await wordsChunk(probe, "fr");
  await probe.close();
  let dropped = 0;
  await page.route(`**${fr}`, (route) => (dropped++ === 0 ? route.abort() : route.continue()));
  await page.goto(site + "/fr/features", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  check("failed first words: tried again", dropped >= 2 && (await page.locator("#root[data-prerendered]").count()) === 0, `requests ${dropped}`);
  check("failed first words: page in French", (await page.locator(".footer-column h2").first().textContent())?.trim() === packs.fr.labels.footerProduct);
  check("failed first words: no page errors", errors.length === 0, errors.join(" | "));
  await context.close();
}
{
  // no words at all: the prerendered page stays readable and nothing breaks
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "ru-RU" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const chunks = (await (await fetch(site + "/ru/features")).text()).match(/name="zrzur-words" content="([^"]+)"/)[1].split(",").map((entry) => entry.split("=")[1]);
  await page.route((url) => chunks.includes(url.pathname), (route) => route.abort());
  await page.goto(site + "/ru/features", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  check("no words: prerendered page stays", (await page.locator("#root[data-prerendered] h1").count()) === 1);
  check("no words: no page errors", errors.length === 0, errors.join(" | "));
  check("no words: marked on the page", (await page.getAttribute("html", "data-words-failed")) === "");
  await context.close();
}
for (const language of NEW) {
  // the report form's words fail: a plain message in the page language, and a working retry
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: tag(language) });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let block = true;
  await page.route(/\/assets\/[a-z]{2}-[^/]+\.js$/, async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (block && body.includes("kindLegend")) return route.abort();
    return route.fulfill({ response, body });
  });
  await page.goto(site + pathOf(language, "/report"), { waitUntil: "networkidle" });
  const failed = page.locator(".report-failed");
  await failed.waitFor({ timeout: 5000 }).catch(() => {});
  check(`${language} report: failure message`, Boolean((await failed.textContent().catch(() => ""))?.includes(packs[language].labels.reportLoadFailed)));
  block = false;
  await failed.locator("button").click().catch(() => {});
  await page.locator("#report-description").waitFor({ timeout: 5000 }).catch(() => {});
  check(`${language} report: retry shows the form`, await page.locator("#report-description").isVisible());
  check(`${language} report: no page errors`, errors.length === 0, errors.join(" | "));
  await context.close();
}

await browser.close();
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
