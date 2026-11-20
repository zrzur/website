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
  /** the file on GitHub Releases (github.com/zrzur/desktop/releases/tag/v<version>) */
  url: string;
  /** null until the release files are built; a CI build refuses that (scripts/check-release-ready.mjs) */
  sha256: string | null;
  /** size in MiB, as shown on the page; null until the files are built */
  size: number | null;
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
export const PRODUCT_VERSION = "26.2.0";

export const RELEASES = {
  // web and backend: the values of the last deploy, shown only when the
  // page cannot read the running service (no JavaScript, service down)
  web: {
    repo: "web",
    version: "26.2.0",
    commit: "e44386c3f60f056c92a4df62741494a98ebdcb7c",
    live: { url: "https://app.zrzur.com/build.json", versionKey: "version" },
  },
  backend: {
    repo: "backend",
    version: "26.2.0",
    commit: "a188d98b16f4ae8746feca2c988cdba135835734",
    live: { url: "https://api.zrzur.com/", versionKey: "zrzur" },
  },
  desktop: {
    repo: "desktop",
    version: "26.2.0",
    commit: "b58b6673100ff4ee52207f7a72a044abe3745924",
  },
} as const satisfies Record<ComponentId, Component>;

/**
 * Still to fill in at the release (coordinator): the desktop commit above and
 * the SHA-256 and size of each file below, from SHA256SUMS-<version>.txt on
 * the release; then set this to false. While it is true, or a checksum is
 * null, a CI build stops (scripts/check-release-ready.mjs): the page cannot
 * be published without them.
 */
export const DESKTOP_RELEASE_PENDING: boolean = false;

/** The desktop release on GitHub */
export const RELEASE_PAGE = `https://github.com/zrzur/desktop/releases/tag/v${PRODUCT_VERSION}`;
/** The checksum list beside the files on the release */
export const CHECKSUMS_FILE = `SHA256SUMS-${PRODUCT_VERSION}.txt`;
const asset = (name: string) => `https://github.com/zrzur/desktop/releases/download/v${PRODUCT_VERSION}/${name}`;

/** The desktop files on GitHub Releases, per system, named as the release names them */
export const DESKTOP_DOWNLOADS = {
  windows: [
    { url: asset("Zrzur-Setup-26.2.0-x64.exe"), sha256: "4f9e2211f24801915e021248ebf3147e9477a7a2a25534b51e516a59e6605ded", size: 147, label: "dlWindowsSetup" },
    { url: asset("Zrzur-win32-x64-26.2.0.zip"), sha256: "c09b4fc0b5f467a1816f5f438f0e731c9338a9519773cafde2bcc1b12ef72ef1", size: 151, label: "dlWindowsZip" },
  ],
  mac: [
    { url: asset("Zrzur-darwin-arm64-26.2.0.zip"), sha256: "90b66c291702a2de3f1b30cdb414c4b42cc11c1b4388afc438040f6d6795dfc5", size: 122, label: "dlMacArm" },
    { url: asset("Zrzur-darwin-x64-26.2.0.zip"), sha256: "59eede2ef558286b07228dc4ca7c4bbbde9257a9ebe158490fef752d239dd794", size: 128, label: "dlMacIntel" },
  ],
  linux: [
    { url: asset("zrzur-desktop_26.2.0_amd64.deb"), sha256: "387a977f52cade1df0e6a61b80c2817c84dc5d323c5e6d02d6da92ee0d4c9f2e", size: 92, label: "dlLinuxDeb" },
    { url: asset("Zrzur-linux-x64-26.2.0.zip"), sha256: "34364aa8fc928334f7cb5c0d9eb2f29d00c753569137c2d9b0eeef957a66fbe1", size: 118, label: "dlLinuxZip" },
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
