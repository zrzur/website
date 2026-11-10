// The built site served the way zrzur.com serves it (self-hosted Caddyfile):
// try_files {path} {path}.html {path}/index.html, no /index.html fallback;
// an unknown address gets /<code>/404.html for a language prefix, else
// /404.html, with status 404. For the e2e suites (csp, not-found).
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

export const dist = fileURLToPath(new URL("../../dist/", import.meta.url));
const CODES = ["ar", "de", "fr", "es", "ru", "zh"];
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

/** The file for a path and the status it is sent with */
export function resolve(path) {
  const clean = normalize(decodeURIComponent(path)).replace(/^([\\/])+/, "");
  for (const candidate of [clean, `${clean}.html`, join(clean, "index.html")]) {
    const file = join(dist, candidate);
    if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile()) return { file, status: 200 };
  }
  const code = path.match(/^\/([a-z]{2})\//)?.[1];
  return { file: join(dist, CODES.includes(code) ? `${code}/404.html` : "404.html"), status: 404 };
}

/** Starts the server on a free port; headers(file) adds response headers */
export async function serveDist(headers = () => ({})) {
  const server = createServer((req, res) => {
    const { file, status } = resolve(new URL(req.url, "http://x").pathname);
    res.writeHead(status, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", ...headers(file) });
    res.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
