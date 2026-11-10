/**
 * Gathers the post files (content/blog/<slug>/<lang>.md) into posts, newest
 * first. A post is published only when Arabic, English and German are there
 * and every file agrees on the date; French, Spanish, Russian and Chinese are
 * optional (fr.md, es.md, ru.md, zh.md): without one, that language shows the
 * English text. Anything else stops the build with a message that says what
 * to fix. Pure: the site hands it the files through Vite, the build scripts
 * through fs.
 */
import { parsePost, readingMinutes, type PostFile } from "./blog-md.ts";

/** Every post has these three */
export const POST_LANGUAGES = ["ar", "en", "de"] as const;
/** A post may have these too */
export const OPTIONAL_POST_LANGUAGES = ["fr", "es", "ru", "zh"] as const;
export type PostLanguage = (typeof POST_LANGUAGES)[number] | (typeof OPTIONAL_POST_LANGUAGES)[number];
const ALL: readonly string[] = [...POST_LANGUAGES, ...OPTIONAL_POST_LANGUAGES];

export type Post = {
  slug: string;
  date: string;
  cover?: string;
  minutes: { [L in PostLanguage]?: number } & Record<(typeof POST_LANGUAGES)[number], number>;
  text: { [L in PostLanguage]?: PostFile } & Record<(typeof POST_LANGUAGES)[number], PostFile>;
};

/** The words of a post in a language, English when it has no file in that one */
export const postText = (post: Post, language: PostLanguage): { text: PostFile; language: PostLanguage; minutes: number } =>
  post.text[language]
    ? { text: post.text[language]!, language, minutes: post.minutes[language]! }
    : { text: post.text.en, language: "en", minutes: post.minutes.en };

/** "content/blog/why-zrzur/de.md" → ["why-zrzur", "de"] */
export const postFileParts = (file: string) => {
  const match = file.replace(/\\/g, "/").match(/content\/blog\/([^/]+)\/([^/]+)\.md$/);
  return match ? ([match[1], match[2]] as const) : null;
};

export function collectPosts(files: Record<string, string>): Post[] {
  const bySlug = new Map<string, { [L in PostLanguage]?: PostFile }>();
  for (const [file, source] of Object.entries(files)) {
    const parts = postFileParts(file);
    if (!parts) continue;
    const [slug, lang] = parts;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
      throw new Error(`content/blog/${slug}: the folder name is the address; use small Latin letters, digits and dashes (why-zrzur)`);
    if (!ALL.includes(lang))
      throw new Error(`content/blog/${slug}/${lang}.md: the file name must be ar.md, en.md or de.md (or fr.md, es.md, ru.md, zh.md)`);
    const entry = bySlug.get(slug) ?? {};
    entry[lang as PostLanguage] = parsePost(source, `content/blog/${slug}/${lang}.md`);
    bySlug.set(slug, entry);
  }
  const posts: Post[] = [];
  for (const [slug, entry] of bySlug) {
    const missing = POST_LANGUAGES.filter((lang) => !entry[lang]);
    if (missing.length)
      throw new Error(`content/blog/${slug}: add ${missing.map((lang) => `${lang}.md`).join(" and ")}; every post is published in Arabic, English and German`);
    const text = entry as Post["text"];
    const languages = Object.keys(text) as PostLanguage[];
    const dates = new Set(languages.map((lang) => text[lang]!.date));
    if (dates.size > 1) throw new Error(`content/blog/${slug}: every file must have the same date`);
    const cover = text.en.cover ?? text.ar.cover ?? text.de.cover;
    const minutes = Object.fromEntries(languages.map((lang) => [lang, readingMinutes(text[lang]!.words)])) as Post["minutes"];
    posts.push({ slug, date: text.en.date, cover, minutes, text });
  }
  return posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}
