/** The blog posts for the build scripts: the same files and checks as the site */
import { readdirSync, readFileSync } from "node:fs";

import { collectPosts } from "../src/blog-posts.ts";

export function readPosts() {
  const root = new URL("../content/blog/", import.meta.url);
  const files = {};
  for (const slug of readdirSync(root, { withFileTypes: true }))
    if (slug.isDirectory())
      for (const file of readdirSync(new URL(`${slug.name}/`, root)))
        if (file.endsWith(".md")) files[`content/blog/${slug.name}/${file}`] = readFileSync(new URL(`${slug.name}/${file}`, root), "utf8");
  return collectPosts(files);
}
