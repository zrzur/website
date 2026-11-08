/**
 * Gathers the post files (content/blog/<slug>/<lang>.md) into posts, newest
 * first. A post is published only when all three languages are there and agree
 * on the date; anything else stops the build with a message that says what to fix.
 * Pure: the site hands it the files through Vite, the build scripts through fs.
 */
import { parsePost, readingMinutes, type PostFile } from "./blog-md.ts";

export const POST_LANGUAGES = ["ar", "en", "de"] as const;
export type PostLanguage = (typeof POST_LANGUAGES)[number];
export type Post = {
  slug: string;
  date: string;
  cover?: string;
  minutes: Record<PostLanguage, number>;
  text: Record<PostLanguage, PostFile>;
};

export function collectPosts(files: Record<string, string>): Post[] {
  const bySlug = new Map<string, Partial<Record<PostLanguage, PostFile>>>();
  for (const [file, source] of Object.entries(files)) {
    const match = file.replace(/\\/g, "/").match(/content\/blog\/([^/]+)\/([^/]+)\.md$/);
    if (!match) continue;
    const [, slug, lang] = match;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
      throw new Error(`content/blog/${slug}: the folder name is the address; use small Latin letters, digits and dashes (why-zrzur)`);
    if (!(POST_LANGUAGES as readonly string[]).includes(lang))
      throw new Error(`content/blog/${slug}/${lang}.md: the file name must be ar.md, en.md or de.md`);
    const entry = bySlug.get(slug) ?? {};
    entry[lang as PostLanguage] = parsePost(source, `content/blog/${slug}/${lang}.md`);
    bySlug.set(slug, entry);
  }
  const posts: Post[] = [];
  for (const [slug, entry] of bySlug) {
    const missing = POST_LANGUAGES.filter((lang) => !entry[lang]);
    if (missing.length)
      throw new Error(`content/blog/${slug}: add ${missing.map((lang) => `${lang}.md`).join(" and ")}; every post is published in Arabic, English and German`);
    const text = entry as Record<PostLanguage, PostFile>;
    const dates = new Set(POST_LANGUAGES.map((lang) => text[lang].date));
    if (dates.size > 1) throw new Error(`content/blog/${slug}: the three files must have the same date`);
    const cover = text.en.cover ?? text.ar.cover ?? text.de.cover;
    posts.push({
      slug,
      date: text.en.date,
      cover,
      minutes: { ar: readingMinutes(text.ar.words), en: readingMinutes(text.en.words), de: readingMinutes(text.de.words) },
      text,
    });
  }
  return posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}
