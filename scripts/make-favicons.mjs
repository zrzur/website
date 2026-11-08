/**
 * Tab and home-screen icons from the official logo (02-laugh-B, public/assets/logo.svg):
 * the same shape, unchanged, in the action colour #E0195F on no background
 * (owner, 2026-11-08). Writes public/brand/favicon.svg and the PNG and ICO sizes.
 * Usage: E2E_CHROMIUM=<chrome.exe> node scripts/make-favicons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const ACTION = "#E0195F";
const logo = readFileSync(new URL("../public/assets/logo.svg", import.meta.url), "utf8");
const path = logo.match(/<path[^>]*\/>/)[0].replace('fill="currentColor"', `fill="${ACTION}"`);
// the logo's ink spans x 19..237, y 78..186: centre it and let it fill the square
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="14 28 228 228">${path}</svg>\n`;
writeFileSync(new URL("../public/brand/favicon.svg", import.meta.url), svg);

// Playwright from E2E_PLAYWRIGHT_FROM (a package.json that has it), else from here
const from = process.env.E2E_PLAYWRIGHT_FROM ?? new URL("../package.json", import.meta.url).href;
const pw = await import(pathToFileURL(createRequire(from).resolve("@playwright/test")).href);
const chromium = pw.chromium ?? pw.default.chromium;
const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM });
const page = await browser.newPage();
const png = async (size) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  return page.screenshot({ omitBackground: true, type: "png" });
};
const files = { "favicon-16.png": 16, "favicon-32.png": 32, "icon-180.png": 180, "icon-192.png": 192, "icon-512.png": 512, "maskable-192.png": 192, "maskable-512.png": 512 };
const made = {};
for (const [name, size] of Object.entries(files)) {
  made[name] = await png(size);
  writeFileSync(new URL(`../public/brand/${name}`, import.meta.url), made[name]);
}
await browser.close();
// an ICO that holds the 16 and 32 PNGs as they are
const entries = [made["favicon-16.png"], made["favicon-32.png"]];
const header = Buffer.alloc(6 + 16 * entries.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach((data, i) => {
  const size = i === 0 ? 16 : 32;
  const at = 6 + 16 * i;
  header.writeUInt8(size, at);
  header.writeUInt8(size, at + 1);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(data.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
const ico = Buffer.concat([header, ...entries]);
writeFileSync(new URL("../public/brand/favicon.ico", import.meta.url), ico);
writeFileSync(new URL("../public/favicon.ico", import.meta.url), ico);
writeFileSync(new URL("../public/icon-32.png", import.meta.url), made["favicon-32.png"]);
writeFileSync(new URL("../public/apple-touch-icon.png", import.meta.url), made["icon-180.png"]);
console.log(`icons ${Object.keys(files).length + 1}`);
