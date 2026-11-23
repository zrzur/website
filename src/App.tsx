import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  batch,
  createEffect,
  createSignal,
  lazy,
  onCleanup,
  onMount,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import type { Label, Pack } from "./content";
import type { Flock } from "./flock";
import { loadPack } from "./strings";
import { canonicalUrl, resolveAppUrl, resolvePreviewUrl } from "./config";
import {
  LOCALES,
  directionOf,
  localizedPath,
  saveLanguage,
  splitLocale,
  tagOf,
  type Language,
} from "./i18n";
import { legalFooterLinks, legalSlugs } from "./legal-nav";
import { Icon } from "./icon";
import { CallScene } from "./call-scene";
import { hasPost, loadPosts, type Post } from "./blog";
import { canonicalLanguage, metaDescription, metaTitle, pageLanguages } from "./seo";
import { DEFAULT_SIZES, EMPTY_SIZE, HERO_SIZES, PHONE_SIZES, SHOTS, SLOTS, shotFiles, shotFor, type SlotId } from "./shots";
import { loadReportText } from "./report-text";
import type { Block, Inline } from "./blog-md";
import { CHECKSUMS_FILE, DESKTOP_DOWNLOADS, RELEASES, RELEASE_PAGE, displayVersion } from "./releases";

/**
 * The desktop app on zrzur.com, for each system: version, files and
 * checksums come from the release manifest (src/releases.ts). The files are
 * not in this repository: they are put on the server beside the site
 * (`downloads/`), and each checksum is shown so people can check what they got.
 */
const DESKTOP_VERSION = displayVersion(RELEASES.desktop.version);
type DesktopSystem = keyof typeof DESKTOP_DOWNLOADS;
/** The visitor's own system, read once from the browser (Windows when unsure) */
function visitorSystem(): DesktopSystem {
  const agent = typeof navigator === "undefined" ? "" : navigator.userAgent;
  if (/Mac OS X|Macintosh/.test(agent) && !/iPhone|iPad/.test(agent)) return "mac";
  if (/Linux|X11/.test(agent) && !/Android/.test(agent)) return "linux";
  return "windows";
}

export type Page =
  | "home"
  | "features"
  | "project"
  | "download"
  | "guide"
  | "blog"
  | "legal"
  | "report"
  | "404";
/** The post slug a /blog/<slug> path names, undefined for the list, null for no such post */
const slugForPath = (path: string) => {
  const slug = path.replace(/\/$/, "").split("/")[2];
  if (!slug) return undefined;
  return hasPost(slug) ? slug : null;
};
export const pageForPath = (path: string): Page => {
  if (
    path === "/legal" ||
    legalSlugs.some((slug) => path === `/legal/${slug}`)
  )
    return "legal";
  if (/^\/blog(\/[a-z0-9-]+)?\/?$/.test(path) && slugForPath(path) !== null) return "blog";
  const clean = path.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  return (
    (
      {
        "/": "home",
        "/index": "home",
        "/features": "features",
        "/project": "project",
        "/about": "project",
        "/download": "download",
        "/guide": "guide",
        "/report": "report",
      } as Record<string, Page>
    )[clean] || "404"
  );
};

// the long legal texts and the report form load only on their own pages
const LegalPage = lazy(() => import("./legal-page"));
const ReportPage = lazy(() => import("./report"));
/**
 * The code (and for the report form, the words) of a page that loads apart
 * from the first bundle: fetched before the page is drawn, so the page can
 * take the prerendered HTML over as it is, with no blank moment.
 */
export const preparePage = (page: Page, language: Language): Promise<unknown> =>
  page === "legal"
    ? LegalPage.preload()
    : page === "report"
      ? Promise.all([ReportPage.preload(), loadReportText(language)])
      : Promise.resolve();

/** The pages where the flock flies; legal and report pages stay quiet */
const FLOCK_PAGES: readonly Page[] = ["home", "features", "project", "guide", "download", "blog", "404"];

/**
 * What you can do in Zrzur, in four groups of three: each group is one panel
 * with its own real screen (src/shots.ts), so there is no row of identical cards.
 */
const GROUPS = [
  // drawn as the call scene (CallScene); its shared screen shows the real app shot d1 (no live call to capture)
  { id: "talk", title: "groupTalkTitle", body: "groupTalkBody", items: ["fServers", "fDms", "fVoice"], slot: "d1" },
  { id: "run", title: "groupRunTitle", body: "groupRunBody", items: ["fRoles", "fEvents", "fBots"], slot: "d8" },
  { id: "find", title: "groupFindTitle", body: "groupFindBody", items: ["fDiscover", "fJoin", "fImport"], slot: "d4" },
  { id: "yours", title: "groupYoursTitle", body: "groupYoursBody", items: ["fDesigns", "fSaved", "fSaveData"], slot: "d5" },
] as const satisfies readonly { id: string; title: Label; body: Label; items: readonly Label[]; slot: SlotId }[];
/**
 * About how wide the longest unbreakable word of a headline is, in em of the
 * bold headline font: Latin and Cyrillic letters ~0.62 em, Arabic ~0.5 em,
 * Chinese characters 1 em each but each may start a new line.
 */
export function longestWord(text: string): number {
  const width = (word: string) =>
    [...word].reduce((sum, c) => sum + (/[؀-ۿݐ-ݿ]/.test(c) ? 0.5 : 0.62), 0);
  const words = text.split(/\s+|(?=[　-鿿＀-￯])|(?<=[　-鿿＀-￯])/u).filter(Boolean);
  return Math.round(Math.max(1, ...words.map((word) => (/[　-鿿＀-￯]/.test(word) ? 1 : width(word)))) * 100) / 100;
}

/** "n minutes" in Arabic, with the noun agreeing with the number */
export function arabicMinutes(n: number, shown = String(n)): string {
  if (n === 1) return "دقيقة واحدة";
  if (n === 2) return "دقيقتان";
  const rest = n % 100;
  return rest >= 3 && rest <= 10 ? `${shown} دقائق` : `${shown} دقيقة`;
}

/** The two posts of the 26.2.0 launch */
const FEATURES_POST = "/blog/everything-in-zrzur";
const FAMILIAR_POST = "/blog/why-it-looks-familiar";
const GITHUB = "https://github.com/zrzur";

/**
 * The site. main.tsx hands it the words of the first language (already
 * loaded); another language's words load when the visitor picks it.
 */
export default function App(props: { language: Language; pack: Pack; posts: Post[] }) {
  const { language: urlLanguage, path } = splitLocale(location.pathname);
  const page = pageForPath(path);
  const slug = page === "blog" ? slugForPath(path) : undefined;
  // the first values only: later ones come through the setters below
  const [language, setLanguageSignal] = createSignal<Language>(props.language);
  const [pack, setPack] = createSignal<Pack>(props.pack);
  const [posts, setPosts] = createSignal<Post[]>(props.posts);
  const post = () => (slug ? posts().find((entry) => entry.slug === slug) : undefined);
  /** Words and posts of a language, then the page switches to it in one step */
  // only the newest request may change the page: a slow language that
  // arrives after the visitor picked another one is dropped
  let latest = 0;
  async function switchTo(next: Language): Promise<boolean> {
    const ticket = ++latest;
    try {
      const [words, list] = await Promise.all([loadPack(next), page === "blog" ? loadPosts(next) : Promise.resolve(posts())]);
      if (ticket !== latest) return false;
      batch(() => {
        setPack(words);
        setPosts(list);
        setLanguageSignal(next);
      });
      return true;
    } catch {
      // the words did not arrive: the page stays as it is, in its language
      return false;
    }
  }
  // a visitor whose browser prefers another language gets that page's own address
  if (!urlLanguage && language() !== "en" && page !== "404")
    history.replaceState(null, "", localizedPath(path, language()) + location.search + location.hash);

  // dark as at build time, so the page takes the prerendered nodes over as
  // they are; the visitor's theme (set by theme.js) right after
  const [theme, setTheme] = createSignal<"dark" | "light">("dark");
  onMount(() => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"));
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);
  // only drawn while there is no app address (ZR-004): a build with
  // VITE_PUBLIC_APP_URL ships no "not switched on yet" text
  let dialog: HTMLDialogElement | undefined;
  let flockCanvas: HTMLCanvasElement | undefined;
  let flock: Flock | undefined;
  const t = (key: Label) => pack().labels[key];
  /** A site path in the current language */
  const href = (target: string) => localizedPath(target, language());
  /** Where the app and Discover open for a host */
  const linksFor = (host: string) => {
    const app = resolveAppUrl(host, import.meta.env.VITE_PUBLIC_APP_URL);
    return { app, discover: resolvePreviewUrl(host, import.meta.env.VITE_PUBLIC_DISCOVER_URL) ?? (app ? new URL("discover", app).href : null) };
  };
  // first as on zrzur.com, the host the page was rendered for at build time,
  // so the page takes over the prerendered HTML as it is; then for this host
  const [links, setLinks] = createSignal(linksFor("zrzur.com"));
  onMount(() => setLinks(linksFor(location.hostname)));
  const appUrl = () => links().app;
  const discoverUrl = () => links().discover;
  const SUPPORT_MAIL = "mailto:support@zrzur.com";
  // voluntary support; it unlocks nothing (privacy policy, Ko-fi)
  const KOFI_URL = "https://ko-fi.com/zrzur";

  async function setLanguage(next: Language) {
    if (next === language()) return;
    if (!(await switchTo(next))) return;
    saveLanguage(next);
    history.pushState(null, "", localizedPath(path, next) + location.search + location.hash);
  }

  const nav = [
    { page: "features", href: "/features", label: "features" },
    { page: "project", href: "/project", label: "project" },
    { page: "guide", href: "/guide", label: "help" },
    { page: "download", href: "/download", label: "navDownload" },
    { page: "blog", href: "/blog", label: "blog" },
  ] as const;

  // language, direction, titles, canonical and alternates for every page
  createEffect(() => {
    const code = language();
    saveLanguage(code);
    const root = document.documentElement;
    root.lang = tagOf(code);
    root.dir = directionOf(code);
    const title =
      page === "legal"
        ? t("legalTitle")
        : page === "report"
          ? t("reportTitle")
        : page === "blog"
          ? (post()?.text.title ?? t("seoBlogTitle"))
          : t(({ features: "seoFeaturesTitle", project: "seoProjectTitle", download: "seoDownloadTitle", guide: "seoGuideTitle", "404": "notFound" } as const)[page as "features"]);
    // the same title and description as the prerendered page (src/seo.ts)
    document.title = page === "home" ? t("seoHomeTitle") : metaTitle(title, t("brand"), code);
    const description = metaDescription(
      page === "report"
        ? t("reportIntro")
        : page === "blog"
          ? (post()?.text.summary ?? t("seoBlogBody"))
          : t(({ home: "seoHomeBody", features: "seoFeaturesBody", project: "seoProjectBody", download: "seoDownloadBody", guide: "seoGuideBody", "404": "notFoundBody", legal: "legalIntro" } as const)[page as "home"]),
      code,
    );
    const meta = (selector: string, value: string) =>
      document.querySelector(selector)?.setAttribute("content", value);
    meta('meta[name="description"]', description);
    meta('meta[property="og:title"]', document.title);
    meta('meta[property="og:description"]', description);
    meta('meta[property="og:url"]', canonicalUrl(localizedPath(path, canonicalLanguage(path, code))));
    // one canonical URL per page and language, plus its alternates
    // the prerendered page brought its own canonical and alternates: after a
    // language switch they would name the old language, so they go too
    document
      .querySelectorAll('link[data-seo], link[rel="canonical"], link[rel="alternate"][hreflang]')
      .forEach((node) => node.remove());
    if (page !== "404") {
      const add = (rel: string, url: string, hreflang?: string) => {
        const link = document.createElement("link");
        link.rel = rel;
        link.href = url;
        if (hreflang) link.hreflang = hreflang;
        link.dataset.seo = "";
        document.head.append(link);
      };
      // a policy shown in English here points at the English page (src/seo.ts)
      add("canonical", canonicalUrl(localizedPath(path, canonicalLanguage(path, code))));
      for (const locale of LOCALES.filter((entry) => pageLanguages(path).includes(entry.code)))
        add("alternate", canonicalUrl(localizedPath(path, locale.code)), locale.tag);
      add("alternate", canonicalUrl(path), "x-default");
    }
  });
  createEffect(() => {
    document.documentElement.dataset.theme = theme();
    try {
      localStorage.setItem("zrzur-site-theme", theme());
    } catch {
      /* optional preference */
    }
  });
  // back and forward between languages
  onMount(() => {
    const popped = () => void switchTo(splitLocale(location.pathname).language ?? "en");
    window.addEventListener("popstate", popped);
    onCleanup(() => window.removeEventListener("popstate", popped));
  });
  // the flock comes after the first paint and never holds the page back
  onMount(() => {
    if (!flockCanvas) return;
    const start = () =>
      void import("./flock").then(({ startFlock }) => {
        flock = startFlock(flockCanvas!);
        flockCanvas!.dataset.ready = "";
      });
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 600 });
    else setTimeout(start, 200);
    onCleanup(() => flock?.destroy());
  });
  createEffect(() => {
    language();
    theme();
    queueMicrotask(() => flock?.refresh());
  });
  // entrance motion: parts rise in once as they enter; skipped without script
  // or with reduced motion, so nothing is ever hidden for those visitors
  onMount(() => {
    if (
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const parts = document.querySelectorAll<HTMLElement>("[data-rise]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    // what is already on screen stays as the prerendered page showed it: only
    // the parts below rise in as the visitor scrolls to them
    parts.forEach((part) => {
      if (part.getBoundingClientRect().top < innerHeight) part.classList.add("is-in");
      else observer.observe(part);
    });
    document.documentElement.classList.add("rise-ready");
  });
  onMount(() => {
    const update = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", update, { passive: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", escape);
    update();
    onCleanup(() => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", escape);
    });
  });
  // the mobile menu locks the page behind it while open
  createEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen());
  });

  /** The word goes to the sky; on a phone the sky may have scrolled away, so go there */
  function say(text: string) {
    flock?.say(text);
    if ((document.querySelector(".hero-stage")?.getBoundingClientRect().top ?? 0) < 0)
      window.scrollTo({ top: 0 });
  }
  function openAvailability() {
    dialog?.showModal();
  }
  function AppAction(props: { class?: string; arrow?: boolean; label?: Label }) {
    const cls = () => `button ${props.class || "button-primary"}`;
    const text = () => t(props.label ?? "open");
    return (
      <Show
        when={appUrl()}
        fallback={
          <button type="button" class={cls()} onClick={openAvailability}>
            {text()}
            {props.arrow !== false && <Icon name="arrow" class="directional" />}
          </button>
        }
      >
        <a class={cls()} href={appUrl()!} target="_blank" rel="noopener noreferrer">
          {text()}
          {props.arrow !== false && <Icon name="arrow" class="directional" />}
        </a>
      </Show>
    );
  }
  /** The logo (controller face A): white on dark, ink on light (CSS mask of logo.svg) */
  function Brand(props: { footer?: boolean }) {
    return (
      <a
        class={`brand ${props.footer ? "brand-footer" : ""}`}
        href={href("/")}
        aria-label={`${t("brand")} — ${t("home")}`}
      >
        <span class="brand-symbol" aria-hidden="true" />
        <span>{t("brand")}</span>
      </a>
    );
  }
  function ThemeToggle() {
    return (
      <button
        type="button"
        class="icon-button theme-button"
        aria-label={theme() === "dark" ? t("themeLight") : t("themeDark")}
        onClick={() => setTheme(theme() === "dark" ? "light" : "dark")}
      >
        <Icon name={theme() === "dark" ? "sun" : "moon"} />
      </button>
    );
  }
  /** A design-system menu instead of a native select: keyboard, Escape and outside click */
  function LanguageMenu(props: { id: string; up?: boolean }) {
    const [open, setOpen] = createSignal(false);
    const [focus, setFocus] = createSignal(0);
    let root!: HTMLDivElement;
    let button!: HTMLButtonElement;
    let list: HTMLDivElement | undefined;
    const current = () => LOCALES.find((locale) => locale.code === language())!;
    /**
     * The list lives in <body>, not in the header or footer: the footer cuts
     * off whatever leaves its box, which hid the first languages. It goes
     * where it fits whole: above the footer's button, below the header's,
     * the other way when there is more room there.
     */
    function place() {
      if (!list) return;
      const gap = 8;
      const edge = 8;
      const at = button.getBoundingClientRect();
      if (props.up) list.style.width = `${at.width}px`;
      list.style.maxHeight = "";
      const height = list.offsetHeight;
      const width = list.offsetWidth;
      const above = at.top - gap - edge;
      const below = window.innerHeight - at.bottom - gap - edge;
      const up = props.up ? above >= height || above > below : below < height && above > below;
      const room = Math.max(up ? above : below, 132);
      if (height > room) list.style.maxHeight = `${room}px`;
      const shown = Math.min(height, room);
      const rtl = document.documentElement.dir === "rtl";
      // the footer's list starts with its button, the header's ends with it
      const fromStart = !!props.up !== rtl;
      const left = fromStart ? at.left : at.right - width;
      list.style.left = `${Math.max(edge, Math.min(left, window.innerWidth - width - edge)) + window.scrollX}px`;
      list.style.top = `${(up ? at.top - gap - shown : at.bottom + gap) + window.scrollY}px`;
    }
    function show() {
      setFocus(LOCALES.findIndex((locale) => locale.code === language()));
      setOpen(true);
      queueMicrotask(() => {
        place();
        list?.focus({ preventScroll: true });
      });
    }
    function hide(returnFocus = true) {
      setOpen(false);
      if (returnFocus) button.focus();
    }
    function choose(code: Language) {
      setLanguage(code);
      hide();
    }
    function keys(event: KeyboardEvent) {
      const last = LOCALES.length - 1;
      const moves: Record<string, number> = {
        ArrowDown: (focus() + 1) % LOCALES.length,
        ArrowUp: (focus() + last) % LOCALES.length,
        Home: 0,
        End: last,
      };
      if (event.key in moves) {
        event.preventDefault();
        setFocus(moves[event.key]);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose(LOCALES[focus()].code);
      } else if (event.key === "Escape") {
        event.stopPropagation();
        hide();
      } else if (event.key === "Tab") hide(false);
    }
    onMount(() => {
      const outside = (event: PointerEvent) => {
        const target = event.target as Node;
        if (open() && !root.contains(target) && !list?.contains(target)) hide(false);
      };
      const moved = () => open() && place();
      window.addEventListener("resize", moved);
      // the header stays in place while the page scrolls under it
      window.addEventListener("scroll", moved, { passive: true });
      onCleanup(() => {
        window.removeEventListener("resize", moved);
        window.removeEventListener("scroll", moved);
      });
      document.addEventListener("pointerdown", outside);
      onCleanup(() => document.removeEventListener("pointerdown", outside));
    });
    return (
      <div class="language-menu" ref={root}>
        <button
          ref={button}
          type="button"
          class="language-button"
          aria-haspopup="listbox"
          aria-expanded={open()}
          aria-controls={`${props.id}-list`}
          aria-label={`${t("language")}: ${current().name}`}
          onClick={() => (open() ? hide() : show())}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              show();
            }
          }}
        >
          <Icon name="globe" />
          <span lang={current().tag}>{current().name}</span>
        </button>
        <Show when={open()}>
          <Portal>
          <div
            ref={list}
            id={`${props.id}-list`}
            class="language-list"
            role="listbox"
            tabindex="-1"
            aria-label={t("language")}
            aria-activedescendant={`${props.id}-${LOCALES[focus()].code}`}
            onKeyDown={keys}
          >
            <For each={LOCALES}>
              {(locale, index) => (
                <div
                  id={`${props.id}-${locale.code}`}
                  role="option"
                  aria-selected={locale.code === language()}
                  classList={{ "language-option": true, "is-focus": focus() === index() }}
                  lang={locale.tag}
                  dir={locale.dir}
                  onPointerEnter={() => {
                    setFocus(index());
                    // the words start loading before the click lands
                    loadPack(locale.code).catch(() => {
                      /* the click tries again */
                    });
                  }}
                  onClick={() => choose(locale.code)}
                >
                  {locale.name}
                  <Show when={locale.code === language()}>
                    <Icon name="check" />
                  </Show>
                </div>
              )}
            </For>
          </div>
          </Portal>
        </Show>
      </div>
    );
  }
  function FAQ() {
    return (
      <div class="faq-list">
        <For each={pack().faqs}>
          {(item, index) => (
            <details open={index() === 0} data-rise>
              <summary>
                <span>{item.question}</span>
                <Icon name="plus" class="faq-sign" />
              </summary>
              <p>{item.answer}</p>
              <Show when={item.more}>
                {(more) => (
                  <a class="text-link faq-more" href={href(more().path)}>
                    {t(more().label)}
                    <Icon name="arrow" class="directional" />
                  </a>
                )}
              </Show>
            </details>
          )}
        </For>
      </div>
    );
  }
  /**
   * One app screen: the owner's screenshot for this slot (src/shots.ts), or
   * until it exists a marked empty frame of the same size. Only the home
   * page's first picture loads at once; the rest load as they come near.
   */
  function Slot(props: { id: SlotId; hero?: boolean; in?: "ar" | "en" | "de" }) {
    const slot = SLOTS[props.id];
    const wanted = () => props.in ?? language();
    const found = () => shotFor(SHOTS, props.id, wanted(), !!props.in);
    const sizes = () => (props.hero ? HERO_SIZES : slot.phone ? PHONE_SIZES : DEFAULT_SIZES);
    const empty = slot.phone ? EMPTY_SIZE.phone : EMPTY_SIZE.desktop;
    return (
      <figure
        classList={{ "product-shot": true, "phone-shot": slot.phone, "shot-empty": !found(), "shot-rtl": found()?.language === "ar" }}
        data-slot={props.id}
        // the frame takes the shot's own ratio, so it is shown whole and never jumps
        style={found() ? { "aspect-ratio": `${found()!.entry.w} / ${found()!.entry.h}` } : undefined}
      >
        <Show
          when={found()}
          fallback={
            <div class="shot-placeholder" role="img" aria-label={t(slot.alt)} style={{ "aspect-ratio": `${empty.w} / ${empty.h}` }}>
              <span class="shot-placeholder-id" dir="ltr">{props.id.toUpperCase()}</span>
              <span class="shot-placeholder-note">{slot.note[language() === "ar" ? "ar" : "en"]}</span>
              <Show when={props.in}>{(code) => <span class="shot-placeholder-note" lang={code()}>{LOCALES.find((l) => l.code === code())!.name}</span>}</Show>
            </div>
          }
        >
          {(shot) => {
            const files = () => shotFiles(props.id, shot().language, shot().entry, sizes());
            return (
              <picture>
                <source type="image/avif" srcset={files().avif} sizes={files().sizes} />
                <source type="image/webp" srcset={files().webp} sizes={files().sizes} />
                <img
                  src={files().src}
                  alt={t(slot.alt)}
                  width={files().width}
                  height={files().height}
                  loading={props.hero ? "eager" : "lazy"}
                  fetchpriority={props.hero ? "high" : undefined}
                  decoding="async"
                />
              </picture>
            );
          }}
        </Show>
      </figure>
    );
  }
  /** Arabic done properly: the words, the flock greeting, and the same screen in three languages */
  function Languages() {
    const phoneLanguages = () =>
      (["ar", "en", "de"] as const).slice().sort((a, b) => Number(b === language()) - Number(a === language()));
    return (
      <section class="languages home-screen" id="languages" aria-labelledby="languages-title">
        <div class="container languages-grid">
          <div class="languages-copy" data-rise>
            <h2 id="languages-title">{t("langTitle")}</h2>
            <p>{t("langBody")}</p>
          </div>
          {/* the flock greets in each language, one after another */}
          <div class="flock-stage home-greet" data-flock="word" data-words="أهلًا|Hello|Hallo" aria-hidden="true" />
          {/* scrolls sideways on phones: reachable and named for the keyboard */}
          <div class="languages-phones" data-rise tabindex="0" role="group" aria-labelledby="languages-title">
            <For each={phoneLanguages()}>{(code) => <Slot id="m2" in={code} />}</For>
          </div>
        </div>
      </section>
    );
  }
  function CTA() {
    return (
      <section class="home-screen home-start" aria-labelledby="closing-title">
        <div class="container">
          <div class="home-end" data-rise>
            <span class="home-end-mark brand-symbol" aria-hidden="true" />
            <h2 id="closing-title">{t("endTitle")}</h2>
            <p>{t("startBody")}</p>
            <div class="home-actions">
              <AppAction arrow={false} />
              <a class="button button-soft" href={href("/download")}>
                <Icon name="download" />
                {t("downloadApp")}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  /** A short list of what a service does: a name and one line each */
  function Points(props: { items: Label[]; class: string; body?: (key: Label) => Label }) {
    const body = (key: Label) => (props.body ? props.body(key) : (`${key}Body` as Label));
    return (
      <dl class={props.class}>
        <For each={props.items}>
          {(key) => (
            <div>
              <dt>{t(key)}</dt>
              <dd>{t(body(key))}</dd>
            </div>
          )}
        </For>
      </dl>
    );
  }
  /** One service in its own large panel: the words on one side, the real screen on the other */
  function Chapter(props: { id: string; title: string; body: string; points?: Label[]; after?: JSX.Element; phone?: boolean; children: JSX.Element }) {
    return (
      <section class="home-screen" id={props.id} aria-labelledby={`${props.id}-title`}>
        {/* the words in their box at the start side, the picture large and free beside it:
            in Arabic the box is on the right and the picture on the left, in English the reverse */}
        <div classList={{ "home-row": true, "home-with-phone": !!props.phone }} data-rise>
          <div class="home-copy home-card">
            <h2 id={`${props.id}-title`}>{props.title}</h2>
            <p>{props.body}</p>
            <Show when={props.points}>{(points) => <Points class="home-points" items={points()} />}</Show>
            {props.after}
          </div>
          <div classList={{ "home-media": true, "home-phone-frame": !!props.phone }}>{props.children}</div>
        </div>
      </section>
    );
  }
  /** The four things you do on Zrzur, moving across the page; still when motion is reduced */
  function Band() {
    const words = ["band1", "band2", "band3", "band4"] as const;
    const run = () => (
      <For each={[...words, ...words]}>
        {(word) => (
          <>
            <span>{t(word)}</span>
            <span class="band-mark brand-symbol" aria-hidden="true" />
          </>
        )}
      </For>
    );
    return (
      <div class="home-band" aria-hidden="true">
        <div class="home-band-track">
          <div class="home-band-run">{run()}</div>
          <div class="home-band-run">{run()}</div>
        </div>
      </div>
    );
  }
  /** The four groups of what you can do, each a panel with its screen; the sides take turns */
  function Groups() {
    return (
      <For each={GROUPS}>
        {(group) =>
          group.id === "talk" ? (
            <section class="home-screen home-voice" id={group.id} aria-labelledby={`${group.id}-title`}>
              {/* the flock leaves the name and becomes the sound of the call */}
              <div class="flock-stage voice-stage home-wave" data-flock="wave" data-tone="voice" aria-hidden="true" />
              <div class="home-row" data-rise>
                <div class="home-copy home-card">
                  <h2 id={`${group.id}-title`}>{t(group.title)}</h2>
                  <p>{t(group.body)}</p>
                  <Points class="home-points" items={[...group.items]} />
                </div>
                <div class="home-media">
                  <CallScene
                    room={t("demoLounge")}
                    names={[t("demoPeople1"), t("demoPeople2"), t("demoPeople3")]}
                    label={`${t("demoLounge")}, ${t("voiceConnected")}, ${t("demoPeople1")} ${t("voiceSharing")}`}
                    screen={<Slot id="d1" />}
                  />
                </div>
              </div>
            </section>
          ) : (
            <Chapter id={group.id} title={t(group.title)} body={t(group.body)} points={[...group.items]}>
              <Slot id={group.slot} />
            </Chapter>
          )
        }
      </For>
    );
  }
  function Home() {
    return (
      <>
        {/* the first screen: the release line, the headline, its line and the
            two buttons on the start side, the flock writing the name beside
            them on the end side, and the real window under both */}
        <section class="home-hero" aria-labelledby="hero-title">
          <div class="container home-hero-top">
            <div class="home-hero-words">
              {/* --longest: the width of the longest word in em, so CSS can size the
                  headline to fit its column without ever breaking a word */}
              <h1 id="hero-title" style={{ "--longest": String(longestWord(t("heroTitle"))) }}>{t("heroTitle")}</h1>
              <p>{t("heroBody")}</p>
              <div class="home-actions">
                <AppAction arrow={false} />
                <a class="button button-soft" href={href("/download")}>
                  <Icon name="download" />
                  {t("downloadApp")}
                </a>
              </div>
            </div>
            <div class="flock-stage hero-stage" data-flock="word" data-words={t("flockName")} aria-hidden="true" />
          </div>
          <div class="container home-window" id="tour">
            <div class="home-window-frame">
              <Slot id="d1" hero />
            </div>
          </div>
        </section>
        <Band />
        {/* why it looks familiar: the layout people know, kept on purpose */}
        <Chapter
          id="familiar"
          title={t("familiarTitle")}
          body={t("familiarBody")}
          after={
            <a class="text-link" href={href(FAMILIAR_POST)}>
              {t("familiarLink")}
              <Icon name="arrow" class="directional" />
            </a>
          }
        >
          <Slot id="d2" />
        </Chapter>
        <Groups />
        <div class="container home-all">
          <a class="text-link" href={href(FEATURES_POST)}>
            {t("featuresAll")}
            <Icon name="arrow" class="directional" />
          </a>
        </div>
        <Languages />
        {/* open source, and the project it is built on */}
        <section class="home-screen home-open" id="open-source" aria-labelledby="open-title">
          <div class="container home-open-inner" data-rise>
            <h2 id="open-title">{t("openTitle")}</h2>
            <div>
              <p>{t("openBody")}</p>
              <p class="home-open-volunteer">{t("volunteerLine")}</p>
              <p class="home-open-links">
                <a class="text-link" href={href("/source")}>
                  {t("homeOpenSource")}
                  <Icon name="arrow" class="directional" />
                </a>
                <a class="text-link" href={GITHUB} target="_blank" rel="noopener noreferrer">
                  {t("openGithub")}
                  <Icon name="arrowDiagonal" />
                </a>
                <a class="text-link" href={href("/project#volunteers")}>
                  {t("volunteerMore")}
                  <Icon name="arrow" class="directional" />
                </a>
              </p>
            </div>
          </div>
        </section>
        <section class="home-screen home-faq" id="faq" aria-labelledby="faq-title">
          <div class="container home-faq-grid">
            <h2 id="faq-title" data-rise>{t("faqTitle")}</h2>
            <FAQ />
          </div>
        </section>
        {/* the invitation: the logo, one line, the two ways to start */}
        <section class="home-screen home-start" aria-labelledby="start-title">
          <div class="container">
            <div class="home-end" data-rise>
              <span class="home-end-mark brand-symbol" aria-hidden="true" />
              <h2 id="start-title">{t("endTitle")}</h2>
              <p>{t("startBody")}</p>
              <div class="home-actions">
                <AppAction arrow={false} />
                <a class="button button-soft" href={href("/download")}>
                  <Icon name="download" />
                  {t("downloadApp")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  /** Heading of an inner page: the title on one side, the flock's shape on the other */
  function PageHeading(props: { title: Label; body: Label; words?: string }) {
    return (
      <header class="page-heading container">
        <div>
          <h1>{t(props.title)}</h1>
          <p>{t(props.body)}</p>
        </div>
        <div class="flock-stage heading-stage" data-flock="word" data-words={props.words} aria-hidden="true" />
      </header>
    );
  }
  function Mission() {
    return (
      <div class="mission-grid">
        <For each={["Communication", "Language", "Development"] as const}>
          {(part) => (
            <article data-rise>
              <h3>{t(`pillar${part}` as Label)}</h3>
              <p>{t(`pillar${part}Body` as Label)}</p>
            </article>
          )}
        </For>
      </div>
    );
  }
  /** Every feature, in the four groups, then the profile, the phone and the long post */
  function Features() {
    return (
      <>
        <PageHeading title="featuresTitle" body="featuresBody" words="#" />
        <Groups />
        <Chapter id="profile" title={t("profileTitle")} body={t("profileBody")}>
          <div class="shot-pair">
            <Slot id="d6" />
            <Slot id="d7" />
          </div>
        </Chapter>
        <section class="home-screen" id="phone" aria-labelledby="phone-title">
          <div class="container languages-grid">
            <div class="languages-copy" data-rise>
              <h2 id="phone-title">{t("phoneTitle")}</h2>
              <p>{t("phoneBody")}</p>
            </div>
            <div class="languages-phones" data-rise tabindex="0" role="group" aria-labelledby="phone-title">
              <For each={["m1", "m3", "m4", "m5", "m6"] as const}>{(id) => <Slot id={id} />}</For>
            </div>
          </div>
        </section>
        <div class="container home-all">
          <a class="text-link" href={href(FEATURES_POST)}>
            {t("featuresAll")}
            <Icon name="arrow" class="directional" />
          </a>
        </div>
        <CTA />
      </>
    );
  }
  function Project() {
    return (
      <>
        <PageHeading title="projectTitle" body="projectBody" words={t("flockName")} />
        <section class="container project-story">
          <h2 data-rise>{t("projectQuote")}</h2>
          <div class="project-prose" data-rise>
            <p>{t("projectP1")}</p>
            <p>{t("projectP2")}</p>
            <p>{t("projectP3")}</p>
          </div>
        </section>
        <section class="container">
          <Mission />
        </section>
        <section class="container license-section" id="source">
          <div data-rise>
            <h2>{t("licensesTitle")}</h2>
            <p>{t("licensesBody")}</p>
            <p class="fine-print">{t("storyNote")}</p>
          </div>
          <nav class="license-links" aria-label={t("licences")} data-rise>
            <a href={href("/source")}>
              {t("source")}
              <Icon name="arrow" class="directional" />
            </a>
            <a href={href("/legal")}>
              {t("licences")}
              <Icon name="arrow" class="directional" />
            </a>
            <a href={href("/third-party-notices")}>
              {t("thirdParty")}
              <Icon name="arrow" class="directional" />
            </a>
          </nav>
        </section>
        {/* who builds it: volunteers, what that means, how to help, and a request for patience */}
        <section class="container volunteer-section" id="volunteers" aria-labelledby="volunteers-title">
          <h2 id="volunteers-title" data-rise>{t("volunteerTitle")}</h2>
          <div class="volunteer-prose" data-rise>
            <p>{t("volunteerBody")}</p>
            <p class="volunteer-means">{t("volunteerMeans")}</p>
            <ul class="volunteer-list">
              <li>{t("volunteerPoint1")}</li>
              <li>{t("volunteerPoint2")}</li>
              <li>{t("volunteerPoint3")}</li>
            </ul>
            <p>{t("volunteerHelp")}</p>
            <p>
              <a class="text-link" href={GITHUB} target="_blank" rel="noopener noreferrer">
                {t("openGithub")}
                <Icon name="arrowDiagonal" />
              </a>
            </p>
            <p>{t("volunteerRespect")}</p>
          </div>
        </section>
        <section class="container feedback-section">
          <div data-rise>
            <h2>{t("projectFeedbackTitle")}</h2>
            <p>{t("projectFeedbackBody")}</p>
          </div>
          <a class="button button-primary" href={SUPPORT_MAIL}>
            {t("feedback")}
            <Icon name="arrow" class="directional" />
          </a>
        </section>
        <CTA />
      </>
    );
  }
  /**
   * The desktop app for Windows, macOS and Linux from GitHub Releases, in one
   * frame: a row per system (the visitor's own first), what the first-start
   * warning means, how to check a file, and the browser beside it.
   */
  function Download() {
    // Windows as at build time, then the visitor's own system
    const [yours, setYours] = createSignal<DesktopSystem>("windows");
    onMount(() => setYours(visitorSystem()));
    const systems = [
      { id: "windows", name: "Windows", meta: "dlWindowsMeta", how: "dlWindowsHow" },
      { id: "mac", name: "macOS", meta: "dlMacMeta", how: "dlMacHow" },
      { id: "linux", name: "Linux", meta: "dlLinuxMeta", how: "dlLinuxHow" },
    ] as const;
    // the order stays fixed (no jump after the page loads); the visitor's own system is marked
    const size = (mb: number | null) => (mb ? t("dlSize").replace("{size}", String(mb)) : null);
    const checks = () => t("dlChecksums").split("SHA256SUMS-{version}.txt");
    return (
      <>
        <PageHeading title="downloadTitle" body="downloadBody" words={t("flockName")} />
        <section class="container download-systems" aria-label={t("navDownload")}>
          <For each={systems}>
            {(system) => (
              <article classList={{ "download-card": true, "is-yours": system.id === yours() }} id={system.id} data-rise>
                <Show when={system.id === yours()}>
                  <p class="download-yours">{t("dlYours")}</p>
                </Show>
                <h2 dir="ltr">{system.name}</h2>
                <p class="download-meta">{t(system.meta)}</p>
                <div class="download-buttons">
                  <For each={DESKTOP_DOWNLOADS[system.id]}>
                    {(file, index) => (
                      <a
                        classList={{ button: true, "button-primary": system.id === yours() && index() === 0, "button-soft": !(system.id === yours() && index() === 0) }}
                        href={file.url}
                        rel="noopener"
                      >
                        <Icon name="download" />
                        <span>{t(file.label)}</span>
                        <Show when={size(file.size)}>{(text) => <span class="download-size">{text()}</span>}</Show>
                      </a>
                    )}
                  </For>
                </div>
                {/* a command reads left to right inside any language, so it never mixes with Arabic text */}
                <p class="download-how">
                  <For each={t(system.how).replace(/[\u200e\u200f]/g, "").split(/(sudo apt install \S+?\.deb)/)}>
                    {(part, index) => (index() % 2 ? <code dir="ltr">{part}</code> : part)}
                  </For>
                </p>
                {/* each file's checksum, once the release has them */}
                <Show when={DESKTOP_DOWNLOADS[system.id].every((file) => file.sha256)}>
                  <details class="download-check">
                    <summary>{t("downloadCheck")}</summary>
                    <For each={DESKTOP_DOWNLOADS[system.id]}>
                      {(file) => (
                        <p>
                          <span dir="ltr">{file.url.split("/").pop()}</span>
                          <code dir="ltr">{file.sha256}</code>
                        </p>
                      )}
                    </For>
                  </details>
                </Show>
              </article>
            )}
          </For>
        </section>
        <section class="container download-notes">
          <div data-rise>
            <h2>{t("dlUnsignedTitle")}</h2>
            <p>{t("dlUnsignedBody")}</p>
          </div>
          <div data-rise>
            <p class="download-version">
              {t("dlVersion").split("{version}")[0]}
              <span dir="ltr">{DESKTOP_VERSION}</span>
              {t("dlVersion").split("{version}")[1]}
            </p>
            <p>
              {checks()[0]}
              <code dir="ltr">{CHECKSUMS_FILE}</code>
              {checks()[1]}
            </p>
            <a class="text-link" href={RELEASE_PAGE} target="_blank" rel="noopener noreferrer">
              {t("dlRelease")}
              <Icon name="arrowDiagonal" />
            </a>
          </div>
        </section>
        <section class="container download-web">
          <div class="download-browser" data-rise>
            <div>
              <h2 dir="ltr">app.zrzur.com</h2>
              <p>{t("heroFacts")}</p>
            </div>
            <AppAction class="button-soft" label="downloadOpenWeb" arrow={false} />
          </div>
        </section>
        <section class="container web-only">
          <div>
            <h2>{t("trustTitle")}</h2>
            <p>{t("trustBody")}</p>
            {/* no release dates: the people who build it are volunteers (same frame) */}
            <p class="fine-print web-only-note">{t("volunteerDownload")}</p>
            <a class="text-link" href={href("/project#volunteers")}>
              {t("volunteerMore")}
              <Icon name="arrow" class="directional" />
            </a>
          </div>
        </section>
      </>
    );
  }
  /** The blog: the list of posts, or one post with its own heading */
  function Blog() {
    const date = (iso: string) =>
      new Intl.DateTimeFormat(tagOf(language()), { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${iso}T12:00:00Z`));
    const minutes = (n: number) => {
      const shown = new Intl.NumberFormat(tagOf(language())).format(n);
      // Arabic counts its nouns: دقيقة واحدة، دقيقتان، 3 إلى 10 دقائق، 11 دقيقة فما فوق
      if (language() === "ar") return `مدة القراءة: ${arabicMinutes(n, shown)}`;
      return t("blogMinutes").replace("{n}", shown);
    };
    const feed = () => `${import.meta.env.BASE_URL}${language() === "en" ? "" : `${language()}/`}blog/feed.xml`;
    const Parts = (props: { parts: Inline[] }) => (
      <For each={props.parts}>
        {(part) => (
          <Switch fallback={part.text}>
            <Match when={part.kind === "strong"}><strong>{part.text}</strong></Match>
            <Match when={part.kind === "em"}><em>{part.text}</em></Match>
            <Match when={part.kind === "code"}><code>{part.text}</code></Match>
            <Match when={part.kind === "link" && part}>
              {(link) => (
                <a href={link().href} {...(link().href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {link().text}
                </a>
              )}
            </Match>
          </Switch>
        )}
      </For>
    );
    /** One block of a post, as the reader sees it */
    const BlockView = (props: { block: Block }): JSX.Element => {
      const block = props.block;
      switch (block.kind) {
        case "h2":
          return <h2 id={block.id}>{block.text}</h2>;
        case "h3":
          return <h3 id={block.id}>{block.text}</h3>;
        case "p":
          return <p><Parts parts={block.parts} /></p>;
        case "quote":
          return <blockquote><Parts parts={block.parts} /></blockquote>;
        case "ul":
          return <ul><For each={block.items}>{(item) => <li><Parts parts={item} /></li>}</For></ul>;
        case "ol":
          return <ol><For each={block.items}>{(item) => <li><Parts parts={item} /></li>}</For></ol>;
        case "code":
          return <pre dir="ltr"><code>{block.text}</code></pre>;
        case "image":
          return <img class="blog-image" src={block.src} alt={block.alt} loading="lazy" decoding="async" />;
      }
    };
    /** A post in the list: its picture, then date, title and summary; the first one is shown large */
    const Card = (props: { entry: Post; lead?: boolean }) => (
      <article
        classList={{ "blog-card": true, "blog-card-lead": !!props.lead }}
        data-rise
        lang={props.entry.language !== language() ? tagOf(props.entry.language) : undefined}
      >
        <Show when={props.entry.cover}>
          {(cover) => (
            // the title below is the link people read; this one only makes the picture clickable
            <a class="blog-card-cover" href={href(`/blog/${props.entry.slug}`)} tabindex="-1" aria-hidden="true">
              <img class="blog-card-image" src={cover()} alt="" width="1200" height="630" loading={props.lead ? "eager" : "lazy"} decoding="async" />
            </a>
          )}
        </Show>
        <div class="blog-card-text">
        <p class="blog-meta">
          <time dateTime={props.entry.date}>{date(props.entry.date)}</time>
          <span>{minutes(props.entry.minutes)}</span>
        </p>
        <h2>
          <a href={href(`/blog/${props.entry.slug}`)}>{props.entry.text.title}</a>
        </h2>
        <p>{props.entry.text.summary}</p>
        <a class="text-link" href={href(`/blog/${props.entry.slug}`)}>
          {t("blogRead")}
          <Icon name="arrow" class="directional" />
        </a>
        </div>
      </article>
    );
    return (
      <Show
        when={post()}
        fallback={
          <>
            <PageHeading title="blogTitle" body="blogBody" words={t("flockName")} />
            <section class="container blog-list" aria-label={t("blog")}>
              <Show when={posts().length} fallback={<p>{t("blogEmpty")}</p>}>
                <For each={posts()}>{(entry, index) => <Card entry={entry} lead={index() === 0} />}</For>
              </Show>
              <a class="text-link blog-feed" href={feed()}>{t("blogFeed")}</a>
            </section>
          </>
        }
      >
        {(entry) => {
          const text = () => entry().text;
          const sections = () => text().blocks.flatMap((block) => (block.kind === "h2" ? [block] : []));
          const others = () => posts().filter((other) => other.slug !== entry().slug).slice(0, 3);
          return (
            <>
              <article class="container blog-post" lang={entry().language !== language() ? tagOf(entry().language) : undefined}>
                <a class="text-link blog-back" href={href("/blog")}>
                  <Icon name="arrow" class="directional blog-back-icon" />
                  {t("blogBack")}
                </a>
                <p class="blog-meta">
                  <time dateTime={entry().date}>{date(entry().date)}</time>
                  <span>{minutes(entry().minutes)}</span>
                  <span>{t("blogBy")}</span>
                </p>
                <h1>{text().title}</h1>
                <p class="blog-lead">{text().summary}</p>
                <Show when={entry().cover}>
                  {(cover) => <img class="blog-cover" src={cover()} alt="" width="1200" height="630" fetchpriority="high" decoding="async" />}
                </Show>
                <Show when={sections().length > 2}>
                  <nav class="blog-contents" aria-label={t("blogContents")}>
                    <p>{t("blogContents")}</p>
                    <ol>
                      <For each={sections()}>{(section) => <li><a href={`#${section.id}`}>{section.text}</a></li>}</For>
                    </ol>
                  </nav>
                </Show>
                <For each={text().blocks}>{(block) => <BlockView block={block} />}</For>
                <Show when={text().tags.length}>
                  <p class="blog-tags">
                    <For each={text().tags}>{(tag) => <span>{tag}</span>}</For>
                  </p>
                </Show>
              </article>
              <Show when={others().length}>
                <section class="container blog-list blog-more" aria-labelledby="blog-more-title">
                  <h2 id="blog-more-title">{t("blogMore")}</h2>
                  <For each={others()}>{(other) => <Card entry={other} />}</For>
                </section>
              </Show>
            </>
          );
        }}
      </Show>
    );
  }
  function Guide() {
    return (
      <>
        <PageHeading title="helpTitle" body="helpBody" words={t("guideGreeting")} />
        <section class="container guide-layout">
          <ol class="guide-steps">
            <For each={[1, 2, 3, 4]}>
              {(n) => (
                <li data-rise>
                  <h2>{t(`step${n}` as Label)}</h2>
                  <p>{t(`step${n}Body` as Label)}</p>
                </li>
              )}
            </For>
          </ol>
          <aside class="guide-aside">
            <p>{t("footerTag")}</p>
            <AppAction arrow={false} />
            <a class="text-link" href={href("/legal/community-guidelines")}>
              {t("safety")}
              <Icon name="arrow" class="directional" />
            </a>
          </aside>
        </section>
        <section class="questions container home-faq" id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">{t("faqTitle")}</h2>
          <FAQ />
        </section>
      </>
    );
  }
  function NotFound() {
    return (
      <section class="container not-found">
        <div class="flock-stage not-found-stage" data-flock="word" data-words="404" aria-hidden="true" />
        <h1>{t("notFound")}</h1>
        <p>{t("notFoundBody")}</p>
        <div class="button-row">
          <a href={href("/")} class="button button-primary">
            {t("backHome")}
          </a>
          <a href={href("/guide")} class="button button-outline">
            {t("help")}
          </a>
        </div>
      </section>
    );
  }
  function Footer() {
    const column = (title: Label, links: { href: string | null; label: string; external?: boolean; onClick?: () => void }[]) => (
      <nav class="footer-column" aria-label={t(title)}>
        <h2>{t(title)}</h2>
        <ul>
          <For each={links}>
            {(link) => (
              <li>
                <Show
                  when={link.href}
                  fallback={
                    <button type="button" onClick={link.onClick}>
                      {link.label}
                    </button>
                  }
                >
                  <a
                    href={link.href!}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                    <Show when={link.external}>
                      <Icon name="arrowDiagonal" class="footer-external" />
                    </Show>
                  </a>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </nav>
    );
    return (
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-identity">
              <Brand footer />
              <p>{t("footerTag")}</p>
              <a class="footer-volunteer" href={href("/project#volunteers")}>{t("volunteerLine")}</a>
              <span class="footer-language-label" id="footer-language-label">{t("language")}</span>
              <div class="footer-controls">
                <LanguageMenu id="footer-language" up />
                <ThemeToggle />
              </div>
            </div>
            <div class="footer-columns">
              {column("footerProduct", [
                { href: href("/features"), label: t("features") },
                { href: appUrl(), label: t("open"), external: true, onClick: openAvailability },
                ...(discoverUrl() ? [{ href: discoverUrl()!, label: t("discover"), external: true }] : []),
              ])}
              {column("footerProject", [
                { href: href("/project"), label: t("project") },
                { href: href("/source"), label: t("source") },
                { href: KOFI_URL, label: t("supportUs"), external: true },
                { href: href("/project#source"), label: t("licences") },
                { href: href("/third-party-notices"), label: t("thirdParty") },
              ])}
              {column("footerResources", [
                { href: href("/blog"), label: t("blog") },
                { href: href("/guide"), label: t("gettingStarted") },
                { href: href("/guide#faq"), label: t("questions") },
                { href: href("/legal/community-guidelines"), label: t("safety") },
                { href: SUPPORT_MAIL, label: t("feedback") },
              ])}
              {column("footerLegal", [
                ...legalFooterLinks.filter((link) => link.slug !== "paid-services").map((link) => ({ href: href(`/legal/${link.slug}`), label: t(link.label) })),
                { href: href("/legal"), label: t("allPolicies") },
                { href: href("/report"), label: t("reportTitle") },
              ])}
            </div>
          </div>
          <div class="footer-bottom">
            <span class="footer-copy">{t("copyright")}</span>
            <span>{t("footerAttribution")}</span>
            <a class="footer-top-link" href="#main">
              {t("top")}
            </a>
          </div>
        </div>
        {/* the name, very large, cut by the bottom of the page */}
        <div class="footer-word" aria-hidden="true">{t("brand")}</div>
      </footer>
    );
  }
  return (
    <>
      <a class="skip-link" href="#main">
        {t("skip")}
      </a>
      <Show when={FLOCK_PAGES.includes(page)}>
        <canvas ref={flockCanvas} class="flock-canvas" aria-hidden="true" />
      </Show>
      <header classList={{ "site-header": true, "is-scrolled": scrolled() }}>
        <div class="header-inner container">
          <Brand />
          <nav
            classList={{ "main-nav": true, "nav-open": menuOpen() }}
            id="main-navigation"
            aria-label={t("menu")}
          >
            <For each={nav}>
              {(item) => (
                <a
                  href={href(item.href)}
                  aria-current={page === item.page ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(item.label)}
                </a>
              )}
            </For>
            <Show when={discoverUrl()}>
              <a href={discoverUrl()!} target="_blank" rel="noopener noreferrer">
                {t("discover")}
              </a>
            </Show>
            <div class="nav-mobile-extra">
              <AppAction />
            </div>
          </nav>
          <div class="header-actions">
            <div class="header-cta">
              <AppAction arrow={false} class="button-soft" />
            </div>
            <button
              type="button"
              class="icon-button menu-button"
              aria-label={menuOpen() ? t("close") : t("menu")}
              aria-expanded={menuOpen()}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen())}
            >
              <Icon name={menuOpen() ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex="-1">
        <Show when={page === "home"}>
          <Home />
        </Show>
        <Show when={page === "features"}>
          <Features />
        </Show>
        <Show when={page === "project"}>
          <Project />
        </Show>
        <Show when={page === "download"}>
          <Download />
        </Show>
        <Show when={page === "blog"}>
          <Blog />
        </Show>
        <Show when={page === "guide"}>
          <Guide />
        </Show>
        <Suspense>
          <Show when={page === "legal"}>
            <LegalPage language={language()} path={path} t={t} />
          </Show>
          <Show when={page === "report"}>
            <ReportPage
              language={language()}
              title={t("reportTitle")}
              intro={t("reportIntro")}
              failed={t("reportLoadFailed")}
              retry={t("reportRetry")}
            />
          </Show>
        </Suspense>
        <Show when={page === "404"}>
          <NotFound />
        </Show>
      </main>
      <Footer />
      <Show when={!appUrl()}>
        <dialog ref={dialog} class="site-dialog" aria-labelledby="dialog-title">
          <button
            type="button"
            class="icon-button dialog-close"
            aria-label={t("close")}
            onClick={() => dialog?.close()}
          >
            <Icon name="close" />
          </button>
          <div class="availability-content">
            <h2 id="dialog-title">{t("modalTitle")}</h2>
            <p>{t("modalBody")}</p>
            <a href={href("/features")} class="button button-primary">
              {t("explore")}
            </a>
          </div>
        </dialog>
      </Show>
    </>
  );
}
