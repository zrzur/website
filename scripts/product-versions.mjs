/**
 * A short content hash per product picture. The pictures keep fixed names in
 * public/assets/product, so their addresses carry ?v=<hash>: a new capture is
 * a new address, and no browser or CDN cache can keep showing the old one.
 * Shared by vite.config.ts (the app) and scripts/prerender.mjs (the hero preload).
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";

export function readProductVersions(dir) {
  return Object.fromEntries(
    readdirSync(dir)
      .filter((name) => /\.(jpg|avif)$/.test(name))
      .map((name) => [name, createHash("sha256").update(readFileSync(`${dir}/${name}`)).digest("hex").slice(0, 10)]),
  );
}
