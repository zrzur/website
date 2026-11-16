/**
 * The release manifest: which version of each Zrzur part runs on zrzur.com,
 * from which commit, and (for the desktop app) which files are offered.
 *
 * One file, read by the download page, the /source page (AGPL section 13:
 * the exact source of what runs), the tests (test/release-manifest.test.mjs)
 * and the post-publish checks (scripts/site-check.mjs, scripts/check-downloads.mjs).
 * The website's own version and commit come from its build (src/buildInfo.ts).
 *
 * Update it with every deploy of web, backend or the desktop installers (the
 * web and backend rows are only a fallback: /source reads the running ones):
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
  /**
   * Where the running service says what it is, read by /source in the
   * visitor's browser and by the live check: a JSON document with the
   * version under `versionKey` and the full commit under `commit`. A part
   * without it (the desktop app is a download, not a service) shows the
   * values above.
   */
  live?: { url: string; versionKey: string };
}

/**
 * The one product version (owner rule ZR-002): the desktop app, the web app
 * and the server name the same version. The live check fails when a running
 * part says otherwise.
 */
export const PRODUCT_VERSION = "26.1.0-beta.3";

export const RELEASES = {
  // web and backend: the values of the last deploy, shown only when the
  // page cannot read the running service (no JavaScript, service down)
  web: {
    repo: "web",
    version: "26.1.0-beta.3",
    commit: "cab7f9b50d5a2f30b9abb88b229ac9c674c65c49",
    live: { url: "https://app.zrzur.com/build.json", versionKey: "version" },
  },
  backend: {
    repo: "backend",
    version: "26.1.0-beta.3",
    commit: "0edbaf53840eb311effc5bb9d49ad55184e367a5",
    live: { url: "https://api.zrzur.com/", versionKey: "zrzur" },
  },
  desktop: {
    repo: "desktop",
    version: "26.1.0-beta.3",
    commit: "07c120e59f6a335e78e139fd87d905fabc9431bd",
  },
} as const satisfies Record<ComponentId, Component>;

/** The desktop files on zrzur.com/downloads, per system */
export const DESKTOP_DOWNLOADS = {
  windows: [
    { url: "/downloads/Zrzur-Setup-26.1.0-beta.3-x64.exe", sha256: "e41179330b6e179abf0a07850d2b57ac3533166f177c0990cf2bb8d1e8c5f6c5", size: 147, label: "dlWindowsSetup" },
    { url: "/downloads/Zrzur-win32-x64-26.1.0-beta.3.zip", sha256: "7a57ba97381b31ae2419eb773e58e0347389129915dff5c15ab5be841787dfa1", size: 151, label: "dlWindowsZip" },
  ],
  mac: [
    { url: "/downloads/Zrzur-darwin-arm64-26.1.0-beta.3.zip", sha256: "4e2c281aaf04a4eb5f1f7bb22bb4e206612c6454a44ce1919636050a9b3503c5", size: 121, label: "dlMacArm" },
    { url: "/downloads/Zrzur-darwin-x64-26.1.0-beta.3.zip", sha256: "139c2f13373d5617df293ffd4999f306a570ea2371f05e6ad2b64294dadbe462", size: 128, label: "dlMacIntel" },
  ],
  linux: [
    { url: "/downloads/zrzur-desktop_26.1.0-beta.3_amd64.deb", sha256: "495c02c6507bcc962a8314d98778c2229686d561b0e2db439ac834aeef201d76", size: 92, label: "dlLinuxDeb" },
    { url: "/downloads/Zrzur-linux-x64-26.1.0-beta.3.zip", sha256: "eb94b1a88ce29422bb3c8d6485351055ac8acd573e81dc7d1711f80bd348899a", size: 118, label: "dlLinuxZip" },
  ],
} as const satisfies Record<string, readonly DesktopFile[]>;

/** "26.1.0-beta.3" → "26.1.0 Beta 3", "26.1.0" → "26.1.0" */
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
