// Real visitor actions on the marketing site, in ar/en/de at 1280 px and 375 px:
// send a word in the live hero and see it land, change language from the menu
// with the keyboard, walk the screen tour, open the phone menu. Also checks the
// rules that keep the design honest: no native select, no sideways scroll,
// 44 px targets on phones, nothing moving with reduced motion.
// Needs the built site: npm run build && npx vite preview --port 14931
// Usage: E2E_SITE=http://127.0.0.1:14931 E2E_PLAYWRIGHT_FROM=<package.json> \
//   E2E_CHROMIUM=<chrome path> node test/e2e/site-live.e2e.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test");
  process.exit(2);
}
const mod = await import(pathToFileURL(createRequire(from).resolve("@playwright/test")).href);
const { chromium } = mod.default ?? mod;
const site = process.env.E2E_SITE ?? "http://127.0.0.1:14826";

const words = { ar: "مرحبًا", en: "Hello", de: "Hallo" };
const pathOf = (language, path = "/") =>
  language === "en" ? path : `/${language}${path === "/" ? "/" : path}`;

let failed = 0;
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed++;
  else {
    failed++;
    console.log(`FAIL ${name} ${detail}`);
  }
}

/** Counts lit pixels of the flock canvas */
const birds = (page) =>
  page.evaluate(() => {
    const canvas = document.querySelector(".flock-canvas");
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let lit = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 40) lit++;
    return lit;
  });

const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM || undefined });
for (const width of [1280, 375])
  for (const language of ["ar", "en", "de"]) {
    const where = `${language} ${width}`;
    const context = await browser.newContext({
      viewport: { width, height: width < 700 ? 812 : 800 },
      locale: language,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(site + pathOf(language), { waitUntil: "networkidle" });

    check(`${where} direction`, (await page.getAttribute("html", "dir")) === (language === "ar" ? "rtl" : "ltr"));
    check(`${where} dark by default`, (await page.getAttribute("html", "data-theme")) === "dark");
    check(`${where} one h1`, (await page.locator("h1").count()) === 1);
    check(`${where} no native select`, (await page.locator("select").count()) === 0);

    // the live hero: type, send, the message lands and the flock answers
    await page.waitForSelector(".flock-canvas[data-ready]");
    await page.waitForTimeout(2500);
    const composer = page.locator(".app-composer input");
    await composer.fill(words[language]);
    await page.locator(".app-composer button").click();
    await page.locator(".app-message-new", { hasText: words[language] }).waitFor();
    check(`${where} composer empties`, (await composer.inputValue()) === "");
    await page.waitForTimeout(2200);
    const lit = await birds(page);
    check(`${where} flock in the sky`, lit > 150, String(lit));

    // an empty message does nothing
    check(`${where} send is off when empty`, await page.locator(".app-composer button").isDisabled());

    // the tour: choose a screen, see that screen
    await page.locator("#tour").scrollIntoViewIfNeeded();
    await page.locator('#tour-tab-roles').click();
    await page.locator("#tour-panel img").first().waitFor();
    check(
      `${where} tour shows the chosen screen`,
      (await page.locator("#tour-panel .shot-roles").count()) === 1,
    );

    // language from the menu, keyboard only on desktop, chips on the phone
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    const target = language === "de" ? "en" : "de";
    if (width >= 700) {
      await page.locator("#header-language-list").waitFor({ state: "detached" });
      await page.locator(".header-language .language-button").focus();
      await page.keyboard.press("Enter");
      await page.locator("#header-language-list").waitFor();
      await page.keyboard.press("End");
      await page.keyboard.press("Escape");
      await page.locator("#header-language-list").waitFor({ state: "detached" });
      await page.locator(".header-language .language-button").click();
      await page.locator(`#header-language-${target}`).click();
    } else {
      await page.locator(".menu-button").click();
      await page.locator(".language-chips button", { hasText: target === "de" ? "Deutsch" : "English" }).click();
      check(`${where} menu chip marks the language`, await page.locator('.language-chips [aria-pressed="true"]').isVisible());
      await page.locator(".menu-button").click();
    }
    await page.waitForFunction((code) => document.documentElement.lang === code, target);
    check(`${where} address follows the language`, new URL(page.url()).pathname === pathOf(target));

    // every public page opens, stays inside the screen, and keeps phone targets
    await context.addInitScript((code) => localStorage.setItem("zrzur-site-language", code), language);
    for (const path of ["/", "/features", "/project", "/guide", "/report", "/legal", "/legal/privacy", "/download"]) {
      await page.goto(site + pathOf(language, path), { waitUntil: "networkidle" });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`${where} ${path} no sideways scroll`, over <= 0, `${over}px`);
      if (width < 700) {
        const small = await page.evaluate(() =>
          [...document.querySelectorAll("a, button, input, textarea, [role=tab]")]
            .filter((el) => {
              const box = el.getBoundingClientRect();
              if (!box.width || el.closest(".legal-section, .legal-sources, .app-composer, p")) return false;
              return box.height < 44 && !(el.tagName === "INPUT" && (el.type === "radio" || el.type === "checkbox"));
            })
            .map((el) => `${el.tagName} ${el.textContent.trim().slice(0, 24)} ${Math.round(el.getBoundingClientRect().height)}`),
        );
        check(`${where} ${path} 44 px targets`, small.length === 0, small.slice(0, 5).join(", "));
      }
    }
    check(`${where} no page errors`, errors.length === 0, errors.join(" | "));
    await context.close();
  }

// reduced motion: the flock is a still picture and nothing is hidden
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
    locale: "ar",
  });
  const page = await context.newPage();
  await page.goto(site + "/ar/", { waitUntil: "networkidle" });
  await page.waitForSelector(".flock-canvas[data-ready]");
  await page.waitForTimeout(1200);
  const first = await birds(page);
  await page.waitForTimeout(700);
  const second = await birds(page);
  check("reduced motion draws the flock", first > 500, String(first));
  check("reduced motion keeps it still", first === second, `${first} ${second}`);
  check("reduced motion hides nothing", (await page.locator("html.rise-ready").count()) === 0);
  await context.close();
}
await browser.close();
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
