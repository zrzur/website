/**
 * The blog on the site: every post under content/blog/<slug>/<lang>.md, read at
 * build time (the files ship inside the page bundle, no request at run time).
 * How to write a post: content/blog/README.md.
 */
import { collectPosts } from "./blog-posts.ts";

const files = import.meta.glob("../content/blog/*/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export const posts = collectPosts(files);
export type { Post, PostLanguage } from "./blog-posts.ts";
