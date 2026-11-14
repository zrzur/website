<!-- zrzur-publication -->
# Zrzur Website

The source of [zrzur.com](https://zrzur.com): home, features, download, guide, blog and the legal pages, in seven languages. Built with Solid.js, TypeScript and Vite, and rendered to static pages at build time.

## Quick start

```bash
git clone https://github.com/zrzur/website.git
cd website
npm ci
npm test
npm run build
npm run preview
```

Needs Git and Node.js 24. The preview is at http://127.0.0.1:14826/.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 14826 |
| `npm test` | Content, translation and legal-page tests |
| `npm run check` | Type check |
| `npm run build` | Static site in `dist/` |
| `npm run preview` | Serve `dist/` locally |

## Configuration

The public addresses are optional and go in `.env.local`; [`.env.example`](./.env.example) lists them. Nothing is filled in by default.

## Hosting

`dist/` is plain static files. The host needs a fallback to `index.html` for addresses that have no file of their own.

## What is inside

| Path | Role |
| --- | --- |
| `src/` | Pages and components |
| `src/locales/` | The texts, one file per language |
| `content/blog/` | Blog posts in Markdown |
| `public/` | Images, fonts and downloads |
| `scripts/` | Sitemap and static rendering |

## Contributing and security

- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md).
- Security reports: [SECURITY.md](./SECURITY.md).

## Licence and origin

Zrzur is an independent, Arabic-first chat platform based on the open-source Stoat software (formerly Revolt), licensed under AGPL-3.0 or later. Zrzur is not affiliated with Stoat, stoat.chat or Revolt Platforms Ltd. Please do not report Zrzur issues to the Stoat team.

- Licence: see [LICENSE](./LICENSE).
- Notices and changes: [NOTICE](./NOTICE), [NOTICE.md](./NOTICE.md) (images and other assets), [MODIFICATIONS.md](./MODIFICATIONS.md), [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md).
