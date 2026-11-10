// The blog: every post is published in all three languages with a full header,
// and the Markdown reader lets no HTML or unsafe link through.
import test from "node:test";
import assert from "node:assert/strict";

import { readPosts } from "../scripts/blog-files.mjs";
import { parsePost, inline, anchor } from "../src/blog-md.ts";
import { collectPosts, postText } from "../src/blog-posts.ts";

const post = (body, head = "title: T\nsummary: S\ndate: 2026-11-08") => `---\n${head}\n---\n${body}\n`;

test("every post in content/blog is complete in Arabic, English and German", () => {
  const posts = readPosts();
  assert.ok(posts.length >= 1, "at least one post");
  for (const entry of posts)
    for (const lang of ["ar", "en", "de"]) {
      const text = entry.text[lang];
      assert.ok(text.title && text.summary, `${entry.slug}/${lang}: title and summary`);
      assert.ok(text.summary.length <= 200, `${entry.slug}/${lang}: summary fits a search result (200 characters)`);
      assert.ok(text.words >= 80, `${entry.slug}/${lang}: a real post, not a stub`);
    }
});

test("a post missing a language or a header field stops the build", () => {
  assert.throws(() => collectPosts({ "content/blog/a/en.md": post("Hello") }), /add ar\.md and de\.md/);
  assert.throws(() => parsePost(post("Hi", "title: T\ndate: 2026-11-08")), /"summary" is missing/);
  assert.throws(() => parsePost(post("Hi", "title: T\nsummary: S\ndate: 8.11.2026")), /date must look like/);
  assert.throws(() => collectPosts({ "content/blog/Bad_Name/en.md": post("Hi") }), /folder name is the address/);
  assert.throws(() => parsePost(post("![](/a.png)")), /needs a description/);
});

test("the reader passes no HTML and no unsafe link", () => {
  const parsed = parsePost(post("<script>alert(1)</script> and [x](javascript:alert(1)) and [ok](https://zrzur.com)"));
  const parts = parsed.blocks[0].parts;
  assert.equal(parts[0].kind, "text");
  assert.match(parts[0].text, /<script>/, "kept as plain text, never markup");
  assert.ok(!parts.some((p) => p.kind === "link" && p.href.startsWith("javascript")), "javascript: is not a link");
  assert.ok(parts.some((p) => p.kind === "link" && p.href === "https://zrzur.com"));
  assert.throws(() => parsePost(post("![x](javascript:alert(1))")), /picture address/);
  assert.deepEqual(inline("**a** *b* `c`").map((p) => p.kind), ["strong", "text", "em", "text", "code"]);
  assert.equal(anchor("من أين بدأنا"), "من-أين-بدأنا");
});

test("French, Spanish, Russian and Chinese posts are optional and complete when present", () => {
  for (const entry of readPosts())
    for (const lang of ["fr", "es", "ru", "zh"]) {
      const text = entry.text[lang];
      if (!text) {
        // no file in that language: the page shows the English text
        assert.equal(postText(entry, lang).language, "en");
        continue;
      }
      assert.equal(postText(entry, lang).language, lang);
      assert.ok(text.title && text.summary, `${entry.slug}/${lang}: title and summary`);
      assert.ok(text.summary.length <= 200, `${entry.slug}/${lang}: summary fits a search result`);
      assert.ok(text.words >= 80, `${entry.slug}/${lang}: a real post, not a stub`);
    }
  const files = { "content/blog/a/en.md": post("Hello"), "content/blog/a/ar.md": post("Hi"), "content/blog/a/de.md": post("Hallo") };
  assert.equal(collectPosts(files)[0].text.fr, undefined);
  assert.throws(() => collectPosts({ ...files, "content/blog/a/it.md": post("Ciao") }), /file name must be/);
  assert.throws(() => collectPosts({ ...files, "content/blog/a/fr.md": post("Salut", "title: T\nsummary: S\ndate: 2026-11-09") }), /same date/);
});

test("reading time counts Chinese by characters, not by spaces", () => {
  const han = "我们每天都在改进应用".repeat(40); // 400 characters, no spaces
  assert.equal(parsePost(post(han)).words, 200);
  assert.equal(parsePost(post("one two three")).words, 3);
});
