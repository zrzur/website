# مدونة زرزور: كيف تنشر مقالًا

كل مقال مجلّد واحد فيه ثلاثة ملفات، واحد لكل لغة:

```
content/blog/<اسم-المقال>/ar.md
content/blog/<اسم-المقال>/en.md
content/blog/<اسم-المقال>/de.md
```

اسم المجلد هو عنوان المقال في الموقع: `content/blog/why-zrzur/` يصبح `zrzur.com/ar/blog/why-zrzur`. استخدم حروفًا لاتينية صغيرة وأرقامًا وشَرطات فقط.

## خطوات النشر من GitHub

1. افتح المستودع `zrzur/website` على GitHub واختر الفرع `beta`.
2. ادخل إلى `content/blog/` واضغط **Add file** ثم **Create new file**.
3. اكتب اسم الملف مع المجلد، مثل `my-first-post/ar.md`، والصق المقال.
4. اضغط **Commit changes**. كرّر الخطوتين للملفين `en.md` و`de.md`.
5. بعد الحفظ يختبر GitHub الموقع ويبنيه وينشره على zrzur.com خلال دقائق. تجد سير العمل في تبويب **Actions** باسم «Publish the website».

إذا نقص شيء (لغة، أو تاريخ، أو ملخص) يتوقف النشر وتظهر في **Actions** رسالة تقول بالضبط ما الذي ينقص. الموقع الحالي يبقى كما هو حتى تصلح الخطأ.

## شكل الملف

```
---
title: عنوان المقال
summary: جملة أو جملتان تظهر في القائمة ونتائج البحث ومعاينة الروابط (200 حرف على الأكثر).
date: 2026-11-08
tags: مصدر مفتوح، تصميم
cover: /blog/my-first-post/cover.jpg
---
نص المقال يبدأ هنا.

## عنوان فرعي

فقرة عادية، فيها **خط عريض** و*مائل* و[رابط](https://zrzur.com).

- نقطة أولى
- نقطة ثانية

> اقتباس قصير.

![وصف الصورة لمن لا يراها](/blog/my-first-post/picture.jpg)
```

- `title` و`summary` و`date` إلزامية، والتاريخ نفسه في الملفات الثلاثة.
- `cover` اختيارية: صورة 1200 × 630 تظهر أعلى المقال وعند مشاركة الرابط. ضع الصور في `public/blog/<اسم-المقال>/`.
- لكل صورة وصف بين القوسين المربعين.
- الروابط تبدأ بـ `https://` أو بـ `/` (صفحة من موقعنا). لا يُقبل HTML داخل المقال.
- اكتب العربية بالفصحى. وتظهر المقالات بالتلقائية في خريطة الموقع وفي خلاصات RSS لكل لغة.

## لتظهر المقالات في البحث

- عنوان واضح يقول ما يجده القارئ، والملخص يشرح الفكرة في جملتين.
- عناوين فرعية `##` لكل جزء: يظهر منها فهرس في أعلى المقال إذا كانت ثلاثة أو أكثر.
- كلمات يبحث بها الناس فعلًا (مثل «بديل ديسكورد»، «سيرفر للأصدقاء»)، في سياق طبيعي.
- مقال حقيقي من 300 كلمة أو أكثر، بمعلومات صحيحة عن زرزور كما هو اليوم.

---

# The Zrzur blog: how to publish a post

Each post is one folder with three files, one per language: `content/blog/<post-name>/ar.md`, `en.md` and `de.md`. The folder name is the address: `content/blog/why-zrzur/` becomes `zrzur.com/blog/why-zrzur`. Small Latin letters, digits and dashes only.

**Publishing from GitHub:** open `zrzur/website`, switch to the `beta` branch, go to `content/blog/`, choose **Add file → Create new file**, name it `my-first-post/en.md`, paste the post and **Commit changes**; do the same for `ar.md` and `de.md`. GitHub then tests, builds and publishes the site on zrzur.com within minutes (Actions → "Publish the website"). If anything is missing, publishing stops with a message that says what to fix, and the live site stays as it is.

**The header** (`title`, `summary`, `date` required; the same date in all three files; `tags` and a 1200 × 630 `cover` optional) and **the body** (`##`/`###` headings, paragraphs, `-` and `1.` lists, `>` quotes, code blocks, `![description](/path)` pictures, `**bold**`, `*italic*`, `` `code` ``, `[links](https://…)`) are shown in the Arabic example above. No HTML is accepted. Pictures go in `public/blog/<post-name>/`. Posts appear in the sitemap and in an RSS feed per language on their own.
