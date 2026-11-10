/**
 * The blog on the site: every post under content/blog/<slug>/<lang>.md.
 * Each file is its own small chunk, fetched only on the blog pages and only
 * in the visitor's language (English when a post has no file in it).
 * The build checks every post (scripts/blog-files.mjs → collectPosts).
 * How to write a post: content/blog/README.md.
 */
import { parsePost, readingMinutes, type PostFile } from "./blog-md.ts";
import { postFileParts } from "./blog-posts.ts";
import type { Language } from "./i18n";

const files = import.meta.glob("../content/blog/*/*.md", { query: "?raw", import: "default" }) as Record<string, (() => Promise<string>) | undefined>;

export type Post = {
  slug: string;
  date: string;
  cover?: string;
  minutes: number;
  text: PostFile;
  /** The language the text is in: the page's, or English */
  language: Language;
};

const slugs = [...new Set(Object.keys(files).map((file) => postFileParts(file)?.[0]).filter((slug): slug is string => !!slug))];

const loaded = new Map<Language, Promise<Post[]>>();
/** The posts in one language, newest first */
export function loadPosts(language: Language): Promise<Post[]> {
  let posts = loaded.get(language);
  if (!posts) {
    posts = Promise.all(
      slugs.map(async (slug) => {
        const own = files[`../content/blog/${slug}/${language}.md`];
        const used: Language = own ? language : "en";
        const text = parsePost(await (own ?? files[`../content/blog/${slug}/en.md`]!)(), `${slug}/${used}.md`);
        return { slug, date: text.date, cover: text.cover, minutes: readingMinutes(text.words), text, language: used };
      }),
    ).then((list) => list.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date))));
    loaded.set(language, posts);
  }
  return posts;
}

/** Whether a path names a post that exists, without loading any post */
export const hasPost = (slug: string) => slugs.includes(slug);
