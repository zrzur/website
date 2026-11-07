/** True for zrzur.com / zrzur.cc and their real subdomains (not suffix spoofs). */
function isZrzurPublicHost(hostname: string): boolean {
  const host = hostname.replace(/\.$/, "").toLowerCase();
  if (host === "zrzur.com" || host === "zrzur.cc") return true;
  if (host.endsWith(".zrzur.com")) {
    const label = host.slice(0, -".zrzur.com".length);
    return Boolean(label) && !label.startsWith(".") && !label.includes("..");
  }
  if (host.endsWith(".zrzur.cc")) {
    const label = host.slice(0, -".zrzur.cc".length);
    return Boolean(label) && !label.startsWith(".") && !label.includes("..");
  }
  return false;
}

export function validatePublicUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (!isZrzurPublicHost(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function resolveAppUrl(
  host: string,
  configured: string | undefined,
): string | null {
  // Local previews may open the already-verified local web client. Production
  // has no loopback or upstream fallback and requires an approved Zrzur URL.
  return (
    validatePublicUrl(configured) ||
    (["localhost", "127.0.0.1", "[::1]"].includes(host)
      ? "http://127.0.0.1:14707/"
      : null)
  );
}

/** The official homepage. zrzur.cc only carries invite and share links. */
export const SITE_ORIGIN = "https://zrzur.com";

// old page names that show the same content as a newer path
const PATH_ALIASES: Record<string, string> = { "/index": "/", "/about": "/project" };

/** Canonical zrzur.com URL for a site path (drops `.html` and trailing slashes). */
export function canonicalUrl(path: string): string {
  // aliases apply after the language prefix (/de/about → /de/project)
  const match = path.match(/^\/(ar|de)(?=\/|$)/);
  const prefix = match ? match[0] : "";
  const rest = path.slice(prefix.length).replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  const page = PATH_ALIASES[rest] ?? rest;
  return SITE_ORIGIN + (prefix ? prefix + (page === "/" ? "" : page) : page);
}
