import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { buildDefine, readReleaseInfo } from './scripts/release-info.mjs';
import { readProductVersions } from './scripts/product-versions.mjs';
import { thirdPartyNotices } from './scripts/third-party-notices.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const assets = fileURLToPath(new URL('./public/assets', import.meta.url));

// version + git commit + tag of this build; the "source code" link uses it
export const releaseInfo = readReleaseInfo({ dir: here, releaseFile: `${here}package.json` });

/** Fonts and icons served from public/assets, with their licence files */
export const noticeExtras = [
  { name: 'Hugeicons (free, stroke rounded)', dir: assets, files: ['Hugeicons-LICENSE.md'], license: 'MIT', source: 'https://hugeicons.com' },
  { name: 'IBM Plex Sans Arabic (font)', dir: assets, files: ['Plex-Arabic-LICENSE.txt'], license: 'OFL-1.1', source: 'https://github.com/IBM/plex' },
  { name: 'IBM Plex Sans (font, Latin and Cyrillic)', dir: assets, files: ['Plex-Latin-LICENSE.txt'], license: 'OFL-1.1', source: 'https://github.com/IBM/plex' },
];

/** Content hash per product picture (scripts/product-versions.mjs) */
export const productVersions = readProductVersions(`${assets}/product`);

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    __ZRZUR_BUILD__: buildDefine(releaseInfo, 'website'),
    __PRODUCT_VERSIONS__: JSON.stringify(productVersions),
  },
  // the --ssr build (src/entry-server.tsx) renders the pages to HTML for
  // scripts/prerender.mjs; it stays in build/ssr and is never served
  plugins: isSsrBuild
    ? [solid({ ssr: true })]
    : // hydratable: the browser takes the prerendered nodes over (src/main.tsx)
      [solid({ ssr: true }), thirdPartyNotices({ productName: 'Zrzur website', extras: noticeExtras })],
  server: { host: '127.0.0.1', port: 14826, strictPort: true },
  preview: { host: '127.0.0.1', port: 14826, strictPort: true },
  // the manifest tells scripts/prerender.mjs which chunk holds each language's words
  build: isSsrBuild ? { target: 'node22', outDir: 'build/ssr', emptyOutDir: true, copyPublicDir: false } : { target: 'es2022', manifest: true },
}));
