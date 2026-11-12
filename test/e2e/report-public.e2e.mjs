// Real user actions on the "Report illegal content" page (no account), in
// en/ar/de at 1280 px and 375 px. Needs the website (E2E_SITE, default
// http://127.0.0.1:14826) and a backend that has POST /safety/public-reports
// (E2E_API, default http://127.0.0.1:14702, built into the site as
// VITE_PUBLIC_API_URL or the loopback default). With E2E_MOCK_API=1 the API
// call is answered by the test (UI-only run; says so in its output).
// Usage: node test/e2e/report-public.e2e.mjs
// Env: E2E_CHROMIUM (headless shell path), E2E_PLAYWRIGHT_FROM (package.json
// that can resolve @playwright/test).
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test");
  process.exit(2);
}
const mod = await import(
  pathToFileURL(createRequire(pathToFileURL(from)).resolve("@playwright/test")).href
);
const pw = mod.chromium ? mod : mod.default;

const SITE = process.env.E2E_SITE ?? "http://127.0.0.1:14826";
const MOCK = process.env.E2E_MOCK_API === "1";
const PREFIX = { en: "", de: "/de", ar: "/ar" };
const VIEWPORTS = { desktop: { width: 1280, height: 860 }, phone: { width: 375, height: 812 } };
const T = {
  en: { send: "Send report", done: "We received your report", csam: "Child sexual abuse material", goodFaithError: "Please confirm the statement.", effect: "A design or profile effect", flashing: "Flashing or harmful: it could cause seizures" },
  de: { send: "Meldung senden", done: "Wir haben deine Meldung erhalten", csam: "Darstellung sexuellen Kindesmissbrauchs", goodFaithError: "Bitte bestätige die Erklärung.", effect: "Ein Design oder einen Profileffekt", flashing: "Blinkend oder schädlich: Es könnte Anfälle auslösen" },
  ar: { send: "إرسال البلاغ", done: "استلمنا بلاغك", csam: "مواد اعتداء جنسي على الأطفال", goodFaithError: "يرجى تأكيد الإقرار.", effect: "تصميم أو مؤثر ملف شخصي", flashing: "وميض أو ضرر: قد يسبب نوبات صرع" },
};

let passed = 0;
const failures = [];
const check = (name, ok, detail = "") => {
  if (ok) passed++;
  else failures.push(`${name} ${detail}`);
};

/**
 * With hCaptcha on, a second report in the same visit gets a new widget and
 * a new token. The hCaptcha script is a stub here: it answers each render with
 * its own token.
 */
async function secondReportWithCheck(lang, text, tag, viewport) {
  const context = await browser.newContext({ viewport, locale: lang });
  const page = await context.newPage();
  const sent = [];
  await page.route("**/challenges.cloudflare.com/turnstile/**", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.turnstile = { n: 0, render(el, o) { const id = ++this.n; el.dataset.rendered = id; o.callback("token-" + id); return id; }, reset() {} };`,
    }),
  );
  await page.route(/:14702\/$/, (route) =>
    route.fulfill({
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ features: { captcha: { enabled: true, key: "site-key" } } }),
    }),
  );
  await page.route("**/safety/public-reports", async (route) => {
    sent.push(JSON.parse(route.request().postData() ?? "{}"));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ _id: "x", reference: "ZR-TEST0001" }),
    });
  });
  const fill = async () => {
    await page.getByLabel(text.csam).check();
    await page.locator("#report-location").fill("https://app.zrzur.com/channel/01HZZZZZZZZZZZZZZZZZZZZZZZ/01HYYYYYYYYYYYYYYYYYYYYYYY");
    await page.locator("#report-description").fill("Illegal material is shared in this channel.");
    await page.locator("#report-goodFaith").check();
    await page.getByRole("button", { name: text.send }).click();
    await page.waitForSelector("[data-testid=report-done]", { timeout: 15000 });
  };
  await page.goto(`${SITE}${PREFIX[lang]}/report`);
  await page.waitForFunction(() => document.querySelector(".report-captcha")?.dataset.rendered === "1");
  await fill();
  await page.locator("[data-testid=report-done] button").click();
  await page.waitForSelector("[data-testid=report-form]");
  await fill();
  check(`${tag} second report has its own token`, sent[0]?.captcha === "token-1" && sent[1]?.captcha === "token-2", JSON.stringify(sent.map((s) => s.captcha)));
  await context.close();
}

const browser = await pw.chromium.launch({
  executablePath: process.env.E2E_CHROMIUM || undefined,
});
/** A report link from Discover or Designs arrives with the form filled in */
async function linkFillsTheForm(lang, viewport, tag) {
  const context = await browser.newContext({ viewport, locale: lang });
  const page = await context.newPage();
  const link = "https://discover.zrzur.com/rabea";
  const query = `?kind=DiscoverServer&location=${encodeURIComponent(link)}`;
  // the link in the page's own language, then the bare one: a German or Arabic
  // browser is moved to its own address and must keep the query
  for (const prefix of [PREFIX[lang], ""]) {
    await page.goto(`${SITE}${prefix}/report${query}`);
    await page.waitForSelector("#report-location");
    check(`${tag} location ${prefix}`, (await page.locator("#report-location").inputValue()) === link);
    const kind = await page.locator('[data-testid=report-form] input[type=radio]:checked').first().inputValue();
    check(`${tag} kind ${prefix}`, kind === "DiscoverServer", kind);
    const url = new URL(page.url());
    check(`${tag} address ${prefix}`, url.pathname === `${PREFIX[lang]}/report` && url.search === query, page.url());
  }
  await context.close();
}

/** A flashing effect: picked by hand, sent as Other, flashing */
async function flashingEffectReport(lang, text, viewport, tag) {
  const context = await browser.newContext({ viewport, locale: lang });
  const page = await context.newPage();
  const sent = [];
  await page.route("**/safety/public-reports", async (route) => {
    sent.push(JSON.parse(route.request().postData() ?? "{}"));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ _id: "x", reference: "ZR-TEST0001" }),
    });
  });
  await page.goto(`${SITE}${PREFIX[lang]}/report`);
  await page.waitForSelector("[data-testid=report-form]");
  await page.getByLabel(text.effect).check();
  await page.getByLabel(text.flashing).check();
  await page.locator("#report-location").fill("https://app.zrzur.com/designs/01HZZZZZZZZZZZZZZZZZZZZZZZ");
  await page.locator("#report-description").fill("This profile effect strobes when a profile opens.");
  await page.locator("#report-name").fill("Sam");
  await page.locator("#report-email").fill("sam@example.org");
  await page.locator("#report-goodFaith").check();
  await page.getByRole("button", { name: text.send }).click();
  await page.waitForSelector("[data-testid=report-done]", { timeout: 15000 });
  check(`${tag} kind`, sent[0]?.target_kind === "CommunityItem", sent[0]?.target_kind);
  check(`${tag} reason`, sent[0]?.category === "Other" && sent[0]?.subcategory === "flashing", JSON.stringify(sent[0]));
  await context.close();
}

for (const [lang, text] of Object.entries(T)) {
  for (const [size, viewport] of Object.entries(VIEWPORTS)) {
    await linkFillsTheForm(lang, viewport, `${lang} ${size} link`);
    if (MOCK) await flashingEffectReport(lang, text, viewport, `${lang} ${size} flashing`);
    const context = await browser.newContext({ viewport, locale: lang });
    const page = await context.newPage();
    const sent = [];
    if (MOCK) {
      await page.route("**/safety/public-reports", async (route) => {
        sent.push(JSON.parse(route.request().postData() ?? "{}"));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ _id: "x", reference: "ZR-TEST0001" }),
        });
      });
    }
    const tag = `${lang}/${size}`;
    await page.goto(`${SITE}${PREFIX[lang]}/report`);
    await page.waitForSelector("[data-testid=report-form]");
    check(`${tag} direction`, (await page.evaluate(() => document.documentElement.dir)) === (lang === "ar" ? "rtl" : "ltr"));

    // nothing sideways at this width
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check(`${tag} no sideways scroll`, !overflow);

    // phone targets are at least 44 px tall
    if (size === "phone") {
      const small = await page.evaluate(() =>
        [...document.querySelectorAll(".report-form .report-choice, .report-form .report-check, .report-form input[type=text], .report-form input[type=email], .report-form button[type=submit]")]
          .filter((el) => el.getBoundingClientRect().height < 44).length,
      );
      check(`${tag} 44px targets`, small === 0, `${small} too small`);
    }

    // sending the empty form shows plain errors and nothing is sent
    await page.getByRole("button", { name: text.send }).click();
    check(`${tag} errors shown`, (await page.locator(".report-error").count()) >= 3);
    check(`${tag} good-faith error`, await page.getByText(text.goodFaithError).isVisible());

    // child sexual abuse material: name and email become optional
    await page.getByLabel(text.csam).check();
    await page.locator("#report-location").fill("https://app.zrzur.com/channel/01HZZZZZZZZZZZZZZZZZZZZZZZ/01HYYYYYYYYYYYYYYYYYYYYYYY");
    await page.locator("#report-description").fill("Illegal material is shared in this channel.");
    await page.locator("#report-goodFaith").check();
    await page.getByRole("button", { name: text.send }).click();
    await page.waitForSelector("[data-testid=report-done]", { timeout: 15000 });
    check(`${tag} done`, await page.getByText(text.done).isVisible());
    const reference = await page.locator("[data-testid=report-done] strong").innerText();
    check(`${tag} reference`, /^ZR-[A-Z0-9]{8}$/.test(reference), reference);
    if (MOCK) {
      check(`${tag} payload`, sent[0]?.subcategory === "minor_safety" && sent[0]?.name === undefined && sent[0]?.language === lang);
    }
    await page.screenshot({ path: join(process.env.E2E_SHOTS ?? tmpdir(), `report-${lang}-${size}.png`), fullPage: true });
    await context.close();
    if (MOCK) await secondReportWithCheck(lang, text, tag, viewport);
  }
}
await browser.close();
console.log(`${MOCK ? "UI only (API mocked)" : "against the real API"}: ${passed} passed, ${failures.length} failed`);
for (const f of failures) console.log("FAIL", f);
process.exit(failures.length ? 1 : 0);
