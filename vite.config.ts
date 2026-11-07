import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { buildDefine, readReleaseInfo } from './scripts/release-info.mjs';
import { thirdPartyNotices } from './scripts/third-party-notices.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const assets = fileURLToPath(new URL('./public/assets', import.meta.url));

// version + git commit + tag of this build; the "source code" link uses it
export const releaseInfo = readReleaseInfo({ dir: here, releaseFile: `${here}package.json` });

/** Fonts and icons served from public/assets, with their licence files */
export const noticeExtras = [
  { name: 'Hugeicons (free, stroke rounded)', dir: assets, files: ['Hugeicons-LICENSE.md'], license: 'MIT', source: 'https://hugeicons.com' },
  { name: 'IBM Plex Sans Arabic (font)', dir: assets, files: ['Plex-Arabic-LICENSE.txt'], license: 'OFL-1.1', source: 'https://github.com/IBM/plex' },
  { name: 'IBM Plex Sans (font)', dir: assets, files: ['Plex-Latin-LICENSE.txt'], license: 'OFL-1.1', source: 'https://github.com/IBM/plex' },
];

export default defineConfig({
  define: { __ZRZUR_BUILD__: buildDefine(releaseInfo, 'website') },
  plugins: [solid(), thirdPartyNotices({ productName: 'Zrzur website', extras: noticeExtras })],
  server: { host: '127.0.0.1', port: 14826, strictPort: true },
  preview: { host: '127.0.0.1', port: 14826, strictPort: true },
  build: { target: 'es2022' },
});
