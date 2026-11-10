/**
 * Blog posts are Markdown files: content/blog/<slug>/<language>.md, each with a
 * short header between two "---" lines:
 *
 *   ---
 *   title: Why we are building Zrzur
 *   summary: One or two sentences for the list, search results and link previews.
 *   date: 2026-11-08
 *   tags: open source, design
 *   cover: /blog/why-zrzur/cover.jpg      (optional, 1200 x 630)
 *   ---
 *
 * The body knows a small, safe part of Markdown: ## and ### headings,
 * paragraphs, - and 1. lists, > quotes, ``` code blocks, ![alt](src) pictures
 * on their own line, and inline **bold**, *italic*, `code` and [links](https://…).
 * No HTML passes through: everything is text, so a post cannot break the page.
 * Shared by the site (Vite) and the build scripts (Node), so it imports nothing.
 */
export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "em"; text: string }
  | { kind: "code"; text: string }
  | { kind: "link"; text: string; href: string };
export type Block =
  | { kind: "h2" | "h3"; id: string; text: string }
  | { kind: "p" | "quote"; parts: Inline[] }
  | { kind: "ul" | "ol"; items: Inline[][] }
  | { kind: "code"; text: string }
  | { kind: "image"; alt: string; src: string };
export type PostFile = {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover?: string;
  blocks: Block[];
  words: number;
};

const FIELDS = ["title", "summary", "date"] as const;

/** A link or picture address we allow: our own paths or https */
export const safeUrl = (href: string) => /^(https:\/\/|\/(?!\/)|#)/.test(href);

/** Heading anchors that read in every script: letters and digits kept, the rest dashes */
export const anchor = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "section";

export function inline(text: string): Inline[] {
  const parts: Inline[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((\S+?)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push({ kind: "text", text: text.slice(last, match.index) });
    if (match[1] !== undefined) parts.push({ kind: "strong", text: match[1] });
    else if (match[2] !== undefined) parts.push({ kind: "em", text: match[2] });
    else if (match[3] !== undefined) parts.push({ kind: "code", text: match[3] });
    else if (safeUrl(match[5])) parts.push({ kind: "link", text: match[4], href: match[5] });
    else parts.push({ kind: "text", text: match[4] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", text: text.slice(last) });
  return parts;
}

/** Reads one post file; throws a plain message naming what is wrong */
export function parsePost(source: string, where = "post"): PostFile {
  const text = source.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const head = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!head) throw new Error(`${where}: the header between two --- lines is missing`);
  const meta: Record<string, string> = {};
  for (const line of head[1].split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  for (const field of FIELDS) if (!meta[field]) throw new Error(`${where}: "${field}" is missing in the header`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${where}: date must look like 2026-11-08`);
  if (meta.cover && !safeUrl(meta.cover)) throw new Error(`${where}: cover must be a /path or an https address`);

  const blocks: Block[] = [];
  const lines = text.slice(head[0].length).split("\n");
  let words = 0;
  // Chinese has no spaces between words: about two characters read like one word
  const count = (value: string) => {
    const han = value.match(/[㐀-鿿豈-﫿]/g)?.length ?? 0;
    const rest = value.replace(/[㐀-鿿豈-﫿　-〿＀-￯]/g, " ");
    words += rest.split(/\s+/).filter(Boolean).length + Math.round(han / 2);
  };
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      i++;
      blocks.push({ kind: "code", text: code.join("\n") });
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const value = heading[2].trim();
      count(value);
      blocks.push({ kind: heading[1].length === 2 ? "h2" : "h3", id: anchor(value), text: value });
      i++;
      continue;
    }
    const image = line.match(/^!\[(.*?)\]\((\S+?)\)\s*$/);
    if (image) {
      if (!safeUrl(image[2])) throw new Error(`${where}: picture address must be a /path or https`);
      if (!image[1].trim()) throw new Error(`${where}: every picture needs a description: ![what it shows](${image[2]})`);
      blocks.push({ kind: "image", alt: image[1], src: image[2] });
      i++;
      continue;
    }
    const list = line.match(/^(-|\d+\.)\s+/);
    if (list) {
      const ordered = list[1] !== "-";
      const items: Inline[][] = [];
      while (i < lines.length && /^(-|\d+\.)\s+/.test(lines[i])) {
        const value = lines[i].replace(/^(-|\d+\.)\s+/, "");
        count(value);
        items.push(inline(value));
        i++;
      }
      blocks.push({ kind: ordered ? "ol" : "ul", items });
      continue;
    }
    const quote = line.startsWith(">");
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|(-|\d+\.)\s|!\[)/.test(lines[i]) && lines[i].startsWith(">") === quote) {
      paragraph.push(lines[i].replace(/^>\s?/, "").trim());
      i++;
    }
    const value = paragraph.join(" ");
    count(value);
    blocks.push({ kind: quote ? "quote" : "p", parts: inline(value) });
  }
  if (!blocks.length) throw new Error(`${where}: the post has no text`);
  return {
    title: meta.title,
    summary: meta.summary,
    date: meta.date,
    tags: (meta.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    cover: meta.cover || undefined,
    blocks,
    words,
  };
}

/** Minutes to read, at about 200 words a minute, never less than one */
export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));

/** Plain text of a run of inline parts (search data, feeds) */
export const plain = (parts: Inline[]) => parts.map((part) => part.text).join("");
