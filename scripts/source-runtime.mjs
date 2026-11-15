// /source.js: on the /source page, read what the running web app and server
// say they are (version and full commit) and show that, instead of the values
// the website was built with (AGPL section 13: the source of what runs).
// Served as a file of the site (the page policy allows scripts only from
// zrzur.com); the page works without it and then says its rows may be older.
// The same functions are used by the tests (test/source-runtime.test.mjs).

const COMMIT = /^[0-9a-f]{40}$/;
const VERSION = /^\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/;
const ORG = "https://github.com/zrzur";

/** The version and commit in a service's answer, or null when either is missing or malformed */
export function readLive(json, versionKey) {
  const version = json && typeof json[versionKey] === "string" ? json[versionKey] : "";
  const commit = json && typeof json.commit === "string" ? json.commit.toLowerCase() : "";
  return VERSION.test(version) && COMMIT.test(commit) ? { version, commit } : null;
}

/** The links of a commit */
export const linksOf = (repo, commit) => ({
  tree: `${ORG}/${repo}/tree/${commit}`,
  archive: `${ORG}/${repo}/archive/${commit}.tar.gz`,
});

/** Which status line to show: every live row read, some, or none tried */
export function statusOf(results) {
  if (!results.length) return "fallback";
  return results.every(Boolean) ? "live" : "partial";
}

async function fetchJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { cache: "no-store", credentials: "omit", signal: controller.signal });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Fills the rows of the page from the running services */
export async function applyLive(doc = document, timeoutMs = 8000) {
  const rows = [...doc.querySelectorAll("tr[data-live]")];
  const results = await Promise.all(
    rows.map(async (row) => {
      const live = readLive(await fetchJson(row.dataset.live, timeoutMs), row.dataset.versionKey);
      if (!live) {
        row.dataset.state = "fallback";
        return false;
      }
      const links = linksOf(row.dataset.repo, live.commit);
      row.querySelector("[data-cell=version]").textContent = live.version;
      row.querySelector("[data-cell=commit]").textContent = live.commit.slice(0, 12);
      row.querySelector("[data-cell=commit]").title = live.commit;
      row.querySelector("[data-link=tree]").href = links.tree;
      row.querySelector("[data-link=archive]").href = links.archive;
      row.dataset.state = "live";
      return true;
    }),
  );
  const status = doc.getElementById("source-status");
  const state = statusOf(results);
  if (status && state !== "fallback") {
    status.textContent = status.dataset[state];
    status.dataset.state = state;
  }
  return state;
}

if (typeof document !== "undefined" && document.getElementById("source-status")) applyLive();
