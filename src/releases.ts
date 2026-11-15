/**
 * The release manifest: which version of each Zrzur part runs on zrzur.com,
 * from which commit, and (for the desktop app) which files are offered.
 *
 * One file, read by the download page, the /source page (AGPL section 13:
 * the exact source of what runs), the tests (test/release-manifest.test.mjs)
 * and the post-publish checks (scripts/site-check.mjs, scripts/check-downloads.mjs).
 * The website's own version and commit come from its build (src/buildInfo.ts).
 *
 * Update it with every deploy of web, backend or the desktop installers:
 * version = the component's RELEASE.json, commit = the commit the deployed
 * build or image was made from (full 40 characters, pushed to GitHub).
 */

export type ComponentId = "web" | "backend" | "desktop";

export interface DesktopFile {
  /** path on zrzur.com */
  url: string;
  sha256: string;
  /** size in MiB, as shown on the page */
  size: number;
  /** the label key in the language packs */
  label: "dlWindowsSetup" | "dlWindowsZip" | "dlMacArm" | "dlMacIntel" | "dlLinuxDeb" | "dlLinuxZip";
}

export interface Component {
  /** the GitHub repository under github.com/zrzur */
  repo: string;
  version: string;
  commit: string;
}

export const RELEASES = {
  web: {
    repo: "web",
    version: "26.1.0-beta.1",
    commit: "7d0d742345809c67fee42787d605a6fb4881ad54",
  },
  backend: {
    repo: "backend",
    version: "26.1.0-beta.1",
    commit: "b31b8293322df2caaecd12cc30df75c219f44396",
  },
  desktop: {
    repo: "desktop",
    version: "26.1.0-beta.2",
    commit: "1b8071f9383ee695f9b02521b78bdfff99e8821b",
  },
} as const satisfies Record<ComponentId, Component>;

/** The desktop files on zrzur.com/downloads, per system */
export const DESKTOP_DOWNLOADS = {
  windows: [
    { url: "/downloads/Zrzur-Setup-26.1.0-beta.2-x64.exe", sha256: "3cb4612258091d8954c563a1e4c540a3e28eb2a85d221a7ddc359f17516967c5", size: 147, label: "dlWindowsSetup" },
    { url: "/downloads/Zrzur-win32-x64-26.1.0-beta.2.zip", sha256: "be50cc31c5177465a86a1c9d51351ffe20ab6efb856d2b2b4447654bdbb39263", size: 151, label: "dlWindowsZip" },
  ],
  mac: [
    { url: "/downloads/Zrzur-darwin-arm64-26.1.0-beta.2.zip", sha256: "2a92ebdd27d4e4267f9cc68e2846f8e64d9cc2307c6493371b924dd1b6ab59bd", size: 121, label: "dlMacArm" },
    { url: "/downloads/Zrzur-darwin-x64-26.1.0-beta.2.zip", sha256: "819a0f3bd18b5149c6c0a952e653620e5e2b9c3731c3f67cb43ac6637742e88e", size: 128, label: "dlMacIntel" },
  ],
  linux: [
    { url: "/downloads/zrzur-desktop_26.1.0-beta.2_amd64.deb", sha256: "d1e5a7111c1b86c93bcd62292569672626c3cf57be3e17369aac0b4532bf3bcc", size: 92, label: "dlLinuxDeb" },
    { url: "/downloads/Zrzur-linux-x64-26.1.0-beta.2.zip", sha256: "841e782a5140ea29f7177bc914ac2df7d000cdbd605ea39d0a8417cbcb6a1aad", size: 118, label: "dlLinuxZip" },
  ],
} as const satisfies Record<string, readonly DesktopFile[]>;

/** "26.1.0-beta.2" → "26.1.0 Beta 2", "26.1.0" → "26.1.0" */
export function displayVersion(version: string): string {
  const match = version.match(/^(\d+\.\d+\.\d+)(?:-(alpha|beta|rc)\.(\d+))?$/);
  if (!match) return version;
  const [, base, stage, number] = match;
  if (!stage) return base;
  const name = stage === "rc" ? "RC" : stage[0].toUpperCase() + stage.slice(1);
  return `${base} ${name} ${number}`;
}

const ORG = "https://github.com/zrzur";
/** The browsable source of one commit */
export const treeUrl = (repo: string, commit: string) => `${ORG}/${repo}/tree/${commit}`;
/** A download of exactly that source */
export const archiveUrl = (repo: string, commit: string) => `${ORG}/${repo}/archive/${commit}.tar.gz`;
