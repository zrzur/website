/**
 * Checks every page of zrzur.com in every language (the route manifest,
 * scripts/route-manifest.mjs): status, lang and dir, canonical, the hreflang
 * set, a title, and no placeholder text. Then the site-wide rules: robots,
 * sitemap = manifest, a real 404, the /source page, http → https and
 * www → apex.
 *
 *   node --experimental-strip-types scripts/site-check.mjs --dist dist
 *     the build output, offline (part of `npm run build`)
 *   node --experimental-strip-types scripts/site-check.mjs --live https://zrzur.com
 *     the published site (after each publish)
 *
 * The "app not switched on yet" dialog text counts as a placeholder whenever
 * the build has an app address (VITE_PUBLIC_APP_URL), and always live.
 * Exit code 1 when anything fails; every failure is listed.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** Text that must never reach a page */
export const PLACEHOLDERS = ["lorem ipsum", "TODO", "TBD:", "[object Object]", "{{", "https\\:", "__VITE_"];

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null;
const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/**
 * The problems of one page.
 * @param {string} html
 * @param {{ url: string, tag: string, dir: string, alternates: { hreflang: string, href: string }[] }} route
 * @param {{ banned?: string[] }} [options] extra text that must not appear (the dialog text)
 * @returns {string[]}
 */
export function checkPage(html, route, options = {}) {
  const problems = [];
  const htmlTag = html.match(/<html\b[^>]*>/)?.[0] ?? "";
  if (attr(htmlTag, "lang") !== route.tag) problems.push(`lang is "${attr(htmlTag, "lang")}", expected "${route.tag}"`);
  if (attr(htmlTag, "dir") !== route.dir) problems.push(`dir is "${attr(htmlTag, "dir")}", expected "${route.dir}"`);
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)].map((m) => attr(m[0], "href"));
  if (canonicals.length !== 1 || canonicals[0] !== route.url)
    problems.push(`canonical is ${JSON.stringify(canonicals)}, expected "${route.url}"`);
  const found = [...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*hreflang="[^"]*"[^>]*>/g)]
    .map((m) => `${attr(m[0], "hreflang")} ${attr(m[0], "href")}`)
    .sort();
  const wanted = route.alternates.map((alt) => `${alt.hreflang} ${alt.href}`).sort();
  if (JSON.stringify(found) !== JSON.stringify(wanted))
    problems.push(`hreflang set differs: missing ${JSON.stringify(wanted.filter((x) => !found.includes(x)))}, extra ${JSON.stringify(found.filter((x) => !wanted.includes(x)))}`);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").trim();
  if (!title) problems.push("no title");
  for (const text of [...PLACEHOLDERS, ...(options.banned ?? [])])
    if (html.includes(text)) problems.push(`placeholder text: ${JSON.stringify(text.slice(0, 60))}`);
  const backslashLinks = [...html.matchAll(/\shref="([^"]*\\[^"]*)"/g)].map((m) => m[1]);
  if (backslashLinks.length) problems.push(`link with a backslash: ${backslashLinks.slice(0, 3).join(", ")}`);
  return problems;
}

/** The URLs a sitemap lists */
export const sitemapUrls = (xml) => [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

/** The dialog text of every language (src/locales/*.ts, label modalBody) */
async function dialogTexts() {
  const texts = [];
  for (const code of ["en", "de", "ar", "fr", "es", "ru", "zh"]) {
    const pack = (await import(`../src/locales/${code}.ts`)).default;
    texts.push(pack.labels.modalBody);
  }
  return texts;
}

/** dist/<page>.html for a canonical URL */
function distFile(dist, url) {
  const path = new URL(url).pathname.replace(/^\//, "");
  return join(dist, path === "" ? "index.html" : `${path}.html`);
}

async function fetchText(url, init = {}) {
  const response = await fetch(url, { redirect: "manual", ...init, headers: { "user-agent": "zrzur-site-check" } });
  return { status: response.status, location: response.headers.get("location"), text: response.status === 200 ? await response.text() : "" };
}

/** Runs `work` over `items`, `limit` at a time */
async function pool(items, limit, work) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await work(items[index]);
      }
    }),
  );
  return results;
}

/**
 * @param {{ dist?: string, live?: string, appUrlSet?: boolean }} target
 * @returns {Promise<{ routes: number, failures: string[] }>}
 */
export async function runChecks(target) {
  const { routeManifest } = await import("./route-manifest.mjs");
  const { RELEASES } = await import("../src/releases.ts");
  const routes = routeManifest();
  const banned = target.live || target.appUrlSet ? await dialogTexts() : [];
  const failures = [];
  const fail = (where, problem) => failures.push(`${where}: ${problem}`);

  // every page in every language
  await pool(routes, 8, async (route) => {
    let html;
    if (target.dist) {
      const file = distFile(target.dist, route.url);
      if (!existsSync(file)) return fail(route.url, `missing ${file}`);
      html = readFileSync(file, "utf8");
    } else {
      const page = await fetchText(target.live + new URL(route.url).pathname);
      if (page.status !== 200) return fail(route.url, `status ${page.status}`);
      html = page.text;
    }
    for (const problem of checkPage(html, route, { banned })) fail(route.url, problem);
  });

  // the sitemap lists exactly the manifest
  const sitemap = target.dist
    ? readFileSync(join(target.dist, "sitemap.xml"), "utf8")
    : (await fetchText(`${target.live}/sitemap.xml`)).text;
  const listed = sitemapUrls(sitemap).sort();
  const expected = routes.map((route) => route.url).sort();
  if (JSON.stringify(listed) !== JSON.stringify(expected))
    fail("sitemap.xml", `lists ${listed.length} URLs, the manifest has ${expected.length}`);

  // robots names the sitemap
  const robots = target.dist
    ? readFileSync(join(target.dist, "robots.txt"), "utf8")
    : (await fetchText(`${target.live}/robots.txt`)).text;
  if (!/^Sitemap: https:\/\/zrzur\.com\/sitemap\.xml$/m.test(robots)) fail("robots.txt", "no Sitemap line for https://zrzur.com/sitemap.xml");

  // the /source page in every language names each part's exact commit
  for (const code of ["en", "de", "ar", "fr", "es", "ru", "zh"]) {
    const path = code === "en" ? "/source" : `/${code}/source`;
    let html;
    if (target.dist) {
      const file = join(target.dist, `${path.slice(1)}.html`);
      html = existsSync(file) ? readFileSync(file, "utf8") : "";
      if (!html) fail(path, "missing");
    } else {
      const page = await fetchText(target.live + path);
      if (page.status !== 200) fail(path, `status ${page.status}${page.location ? ` → ${page.location}` : ""}`);
      html = page.text;
    }
    if (html)
      for (const part of Object.values(RELEASES))
        if (!html.includes(`https://github.com/zrzur/${part.repo}/archive/${part.commit}.tar.gz`))
          fail(path, `no archive link for ${part.repo} ${part.commit.slice(0, 12)}`);
  }

  // the Imprint and contact addresses are plain mailto: links, also without JavaScript
  for (const route of routes.filter((r) => r.path === "/legal/imprint" || r.path === "/legal/contact")) {
    const html = target.dist
      ? (existsSync(distFile(target.dist, route.url)) ? readFileSync(distFile(target.dist, route.url), "utf8") : "")
      : (await fetchText(target.live + new URL(route.url).pathname)).text;
    if (!/href="mailto:[^"@]+@zrzur\.com"/.test(html)) fail(route.url, "no plain mailto: link (email protection rewrote it?)");
    if (html.includes("/cdn-cgi/l/email-protection")) fail(route.url, "an address is hidden behind the CDN's email protection");
  }

  if (target.dist) {
    for (const file of ["404.html", "ar/404.html"]) if (!existsSync(join(target.dist, file))) fail(file, "missing");
  } else {
    // unknown addresses are a real 404, in the address's language
    for (const path of ["/zrzur-site-check-unknown", "/ar/zrzur-site-check-unknown"]) {
      const page = await fetchText(target.live + path);
      if (page.status !== 404) fail(path, `status ${page.status}, expected 404`);
    }
    // http → https and www → the apex domain, each a permanent redirect
    const permanent = (status) => status === 301 || status === 308;
    const redirects = [
      ["http://zrzur.com/download", "https://zrzur.com/download"],
      ["https://www.zrzur.com/download", "https://zrzur.com/download"],
    ];
    for (const [from, to] of redirects) {
      const page = await fetchText(from);
      if (!permanent(page.status) || page.location !== to) fail(from, `${page.status} → ${page.location}, expected 301/308 → ${to}`);
    }
  }
  return { routes: routes.length, failures };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const dist = args[0] === "--dist" ? args[1] : undefined;
  const live = args[0] === "--live" ? args[1]?.replace(/\/$/, "") : undefined;
  if (!dist && !live) {
    console.error("usage: site-check.mjs --dist <dir> | --live <origin>");
    process.exit(2);
  }
  const appUrlSet = Boolean(process.env.VITE_PUBLIC_APP_URL?.trim());
  if (dist && !appUrlSet) console.log("note: VITE_PUBLIC_APP_URL is not set, so the app dialog text is allowed in this build");
  const { routes, failures } = await runChecks({ dist, live, appUrlSet });
  for (const failure of failures) console.error(`FAIL ${failure}`);
  console.log(`site check (${dist ? `dist ${dist}` : live}): ${routes} pages, ${failures.length} failures`);
  process.exit(failures.length ? 1 : 0);
}
