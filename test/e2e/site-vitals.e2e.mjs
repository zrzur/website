// Speed of the built site: LCP, CLS, the JavaScript a page downloads (gzip)
// and the fonts it fetches, on desktop and as a mid-range phone (4x CPU,
// 1.6 Mbps, 150 ms). Also fails when a Latin or Arabic page fetches the
// Cyrillic font, or any page fetches a font it has no letters for.
// Needs the built site: npm run build && npx vite preview --port 14931
// Usage: E2E_SITE=http://127.0.0.1:14931 E2E_PLAYWRIGHT_FROM=<package.json> \
//   [E2E_PAGES=/,/features] [E2E_LANGUAGES=en,ar] node test/e2e/site-vitals.e2e.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const from = process.env.E2E_PLAYWRIGHT_FROM;
if (!from) {
  console.error("Set E2E_PLAYWRIGHT_FROM to a package.json that can resolve @playwright/test");
  process.exit(2);
}
const mod = await import(pathToFileURL(createRequire(from).resolve("@playwright/test")).href);
const { chromium } = mod.default ?? mod;
const site = process.env.E2E_SITE ?? "http://127.0.0.1:14931";
const pages = (process.env.E2E_PAGES ?? "/,/features").split(",");
const languages = (process.env.E2E_LANGUAGES ?? "en").split(",");
const pathOf = (language, path) => (language === "en" ? path : `/${language}${path === "/" ? "/" : path}`);

const observe = () => {
  window.__vitals = { lcp: 0, cls: 0, lcpElement: "", shifts: [] };
  /** what an element is, short: tag.class [width x height] */
  const describe = (el) => {
    if (!el) return "(removed)";
    const box = el.getBoundingClientRect();
    const cls = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/s+/).slice(0, 2).join(".") : "";
    return `${el.tagName.toLowerCase()}${cls} [${Math.round(box.width)}x${Math.round(box.height)}]`;
  };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__vitals.lcp = e.startTime;
      window.__vitals.lcpElement = `${describe(e.element)} size ${e.size}`;
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries())
      if (!e.hadRecentInput) {
        window.__vitals.cls += e.value;
        for (const source of e.sources ?? []) window.__vitals.shifts.push(`${e.value.toFixed(3)} ${describe(source.node?.nodeType === 1 ? source.node : source.node?.parentElement)}`);
      }
  }).observe({ type: "layout-shift", buffered: true });
};

let failed = 0;
const rows = [];
const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM || undefined });
for (const phone of (process.env.E2E_PROFILES ?? "desktop,phone").split(",").map((p) => p === "phone"))
  for (const language of languages)
    for (const path of pages) {
      const context = await browser.newContext({
        viewport: phone ? { width: 375, height: 812 } : { width: 1280, height: 800 },
        locale: language,
      });
      const page = await context.newPage();
      if (phone) {
        const cdp = await context.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await cdp.send("Network.emulateNetworkConditions", {
          offline: false,
          latency: 150,
          downloadThroughput: (1.6 * 1024 * 1024) / 8,
          uploadThroughput: (750 * 1024) / 8,
        });
      }
      await page.addInitScript(observe);
      const scripts = [];
      const fonts = [];
      page.on("response", async (response) => {
        const type = response.request().resourceType();
        const url = new URL(response.url());
        if (type === "script") {
          try {
            scripts.push({ name: url.pathname, gzip: gzipSync(await response.body()).length });
          } catch {
            /* redirected or aborted */
          }
        } else if (type === "font") fonts.push(url.pathname.split("/").pop());
      });
      await page.goto(site + pathOf(language, path), { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      // a click ends LCP recording, as a real visitor's first input does
      const vitals = await page.evaluate(() => window.__vitals);
      const js = scripts.reduce((sum, s) => sum + s.gzip, 0);
      const row = {
        profile: phone ? "phone" : "desktop",
        page: pathOf(language, path),
        lcp: Math.round(vitals.lcp),
        lcpElement: vitals.lcpElement,
        shifts: vitals.shifts.slice(0, 4).join(" | "),
        cls: Number(vitals.cls.toFixed(3)),
        jsGzipKB: Number((js / 1024).toFixed(1)),
        scripts: scripts.map((s) => `${s.name.split("/").pop()} ${(s.gzip / 1024).toFixed(1)}`).join(", "),
        fonts: [...new Set(fonts)].join(", "),
      };
      rows.push(row);
      const cyrillic = fonts.some((f) => f.includes("cyrillic"));
      if (cyrillic && language !== "ru") {
        failed++;
        console.log(`FAIL ${row.profile} ${row.page} fetched the Cyrillic font`);
      }
      await context.close();
    }
await browser.close();
for (const row of rows) console.log(JSON.stringify(row));
console.log(`${rows.length} pages measured, ${failed} failed`);
process.exit(failed ? 1 : 0);
