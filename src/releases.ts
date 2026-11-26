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
export const PRODUCT_VERSION = "26.3.0";

export const RELEASES = {
  // web and backend: the values of the last deploy, shown only when the
  // page cannot read the running service (no JavaScript, service down)
  web: {
    repo: "web",
    version: "26.3.0",
    commit: "351ce138ccbd83eb2022d926ca1f89f0bce0cd9f",
    live: { url: "https://app.zrzur.com/build.json", versionKey: "version" },
  },
  backend: {
    repo: "backend",
    version: "26.3.0",
    commit: "e4759ebe5b08d619d5ffd4ab7cb6c490f60a0320",
    live: { url: "https://api.zrzur.com/", versionKey: "zrzur" },
  },
  desktop: {
    repo: "desktop",
    version: "26.3.0",
    commit: "63dd69e6fad4e79544572874b59c2a778a6791fd",
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
    { url: asset("Zrzur-Setup-26.3.0-x64.exe"), sha256: "d9a541de099c2252aea7ce0c439ba769b62c8ae777e3152b1635e4e9b29444f0", size: 147, label: "dlWindowsSetup" },
    { url: asset("Zrzur-win32-x64-26.3.0.zip"), sha256: "91141e4361d1cd4a935fb2759576f904b7d0479862a05fa308d90126271f3c2f", size: 151, label: "dlWindowsZip" },
  ],
  mac: [
    { url: asset("Zrzur-darwin-arm64-26.3.0.zip"), sha256: "7f8048d733c0b581308cdda032b9abf3f26fbba232fb7183bba8f1cb893c94ec", size: 122, label: "dlMacArm" },
    { url: asset("Zrzur-darwin-x64-26.3.0.zip"), sha256: "f80859252d8089f377cb35b18929f5dde43d6022f437a37ce91777c6aaf4f42b", size: 128, label: "dlMacIntel" },
  ],
  linux: [
    { url: asset("zrzur-desktop_26.3.0_amd64.deb"), sha256: "dc44439c197fd14f03b2dccb1e4f053e06f859d92785f8888d2f4179d607597d", size: 92, label: "dlLinuxDeb" },
    { url: asset("Zrzur-linux-x64-26.3.0.zip"), sha256: "f0477a8cf530bf75ee45d4fb81b6b53468fe921c7525c75d371ef3eea29d7a13", size: 118, label: "dlLinuxZip" },
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
