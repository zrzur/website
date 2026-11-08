import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  createEffect,
  createSignal,
  lazy,
  onCleanup,
  onMount,
  type JSX,
} from "solid-js";
import {
  faqs,
  features,
  labels,
  localize,
  type Label,
  type Partial,
} from "./content";
import { VoiceChannels } from "./demo";
import type { Flock } from "./flock";
import { reportText } from "./report-text";
import { SOURCE_URL, THIRD_PARTY_NOTICES_PATH } from "./buildInfo";
import { canonicalUrl, resolveAppUrl, resolvePreviewUrl } from "./config";
import {
  LOCALES,
  detectLanguage,
  directionOf,
  localizedPath,
  readSavedLanguage,
  saveLanguage,
  splitLocale,
  type Language,
} from "./i18n";
import { legalFooterLinks, legalSlugs } from "./legal-nav";
import { Icon } from "./icon";
import { posts, type Post } from "./blog";
import type { Block, Inline } from "./blog-md";

/**
 * The desktop app on zrzur.com, for each system. The files are not in this
 * repository: they are put on the server beside the site (`downloads/`), and
 * each checksum is shown so people can check what they got. Sizes in MB (MiB).
 */
const DESKTOP_VERSION = "26.0.0-dev";
const DESKTOP_DOWNLOADS = {
  windows: [
    { url: "/downloads/Zrzur-win32-x64-26.0.0-dev.zip", sha256: "c96edb891bb3f118394ad969f24c0133d769571535f3130075b206b28ca2a6dd", size: 151, label: "dlWindowsZip" },
  ],
  mac: [
    { url: "/downloads/Zrzur-darwin-arm64-26.0.0-dev.zip", sha256: "cefd382bd5c96675012237382412f85e33786ba2242107f9920ffadc1c92b3be", size: 121, label: "dlMacArm" },
    { url: "/downloads/Zrzur-darwin-x64-26.0.0-dev.zip", sha256: "1bd59d7ff0582aad14ca674647464f5f3ed256a0a3381b5e4c2ad4a29777c1e9", size: 126, label: "dlMacIntel" },
  ],
  linux: [
    { url: "/downloads/Zrzur-linux-x64-26.0.0-dev.zip", sha256: "8225370e7b2e8465352cd53977538d9cc8c250202b127e06b9e8a8ccf518c6a1", size: 118, label: "dlLinuxZip" },
  ],
} as const;
type DesktopSystem = keyof typeof DESKTOP_DOWNLOADS;
/** The visitor's own system, read once from the browser (Windows when unsure) */
function visitorSystem(): DesktopSystem {
  const agent = typeof navigator === "undefined" ? "" : navigator.userAgent;
  if (/Mac OS X|Macintosh/.test(agent) && !/iPhone|iPad/.test(agent)) return "mac";
  if (/Linux|X11/.test(agent) && !/Android/.test(agent)) return "linux";
  return "windows";
}

/** Content hash per product picture, from vite.config.ts (missing in tests) */
declare const __PRODUCT_VERSIONS__: Record<string, string> | undefined;
const PRODUCT_VERSIONS: Record<string, string> =
  typeof __PRODUCT_VERSIONS__ !== "undefined" ? __PRODUCT_VERSIONS__ : {};

type Page =
  | "home"
  | "features"
  | "project"
  | "download"
  | "guide"
  | "blog"
  | "legal"
  | "report"
  | "404";
/** The post a /blog/<slug> path names, undefined for the list, null for no such post */
const postForPath = (path: string) => {
  const slug = path.replace(/\/$/, "").split("/")[2];
  if (!slug) return undefined;
  return posts.find((entry) => entry.slug === slug) ?? null;
};
const pageForPath = (path: string): Page => {
  if (
    path === "/legal" ||
    legalSlugs.some((slug) => path === `/legal/${slug}`)
  )
    return "legal";
  if (/^\/blog(\/[a-z0-9-]+)?\/?$/.test(path) && postForPath(path) !== null) return "blog";
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

/** Views captured from the running app from the running app with demo accounts */
type View = "chat" | "lobby" | "discover" | "settings" | "roles";
const PHONE_VIEWS: readonly View[] = ["chat", "lobby"];

// the long legal texts and the report form load only on their own pages
const LegalPage = lazy(() => import("./legal-page"));
const ReportPage = lazy(() => import("./report"));

/** The pages where the flock flies; legal and report pages stay quiet */
const FLOCK_PAGES: readonly Page[] = ["home", "features", "project", "guide", "download", "blog", "404"];

const TOUR = [
  { id: "lobby", label: "tabLobby", body: "lobbyBody" },
  { id: "chat", label: "tabChat", body: "chatBody" },
  { id: "settings", label: "tabRoles", body: "commBody" },
  { id: "roles", label: "tabInterests", body: "rolesBody" },
  { id: "discover", label: "tabDiscover", body: "discoverBody" },
] as const;

export default function App() {
  const { language: urlLanguage, path } = splitLocale(location.pathname);
  const page = pageForPath(path);
  const post = page === "blog" ? postForPath(path) : null;
  const [language, setLanguageSignal] = createSignal<Language>(
    detectLanguage(location.pathname, readSavedLanguage(), navigator.languages ?? []),
  );
  // a visitor who prefers German or Arabic gets that page's own address
  if (!urlLanguage && language() !== "en" && page !== "404")
    history.replaceState(null, "", localizedPath(path, language()) + location.search + location.hash);

  const [theme, setTheme] = createSignal<"dark" | "light">(
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);
  let dialog!: HTMLDialogElement;
  let flockCanvas: HTMLCanvasElement | undefined;
  let flock: Flock | undefined;
  const t = (key: Label) => labels[language()][key];
  const l = (value: Partial) => localize(value, language());
  /** A site path in the current language */
  const href = (target: string) => localizedPath(target, language());
  const appUrl = resolveAppUrl(location.hostname, import.meta.env.VITE_PUBLIC_APP_URL);
  const discoverUrl =
    resolvePreviewUrl(location.hostname, import.meta.env.VITE_PUBLIC_DISCOVER_URL) ??
    (appUrl ? new URL("discover", appUrl).href : null);
  const SUPPORT_MAIL = "mailto:support@zrzur.com";

  function setLanguage(next: Language) {
    if (next === language()) return;
    saveLanguage(next);
    setLanguageSignal(next);
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
    root.lang = code;
    root.dir = directionOf(code);
    const title =
      page === "legal"
        ? t("legalTitle")
        : page === "report"
          ? reportText[code].title
        : page === "blog"
          ? (post ? post.text[code].title : t("blog"))
          : t(({ features: "features", project: "project", download: "downloadTitle", guide: "help", "404": "notFound" } as const)[page as "features"]);
    document.title = page === "home" ? t("seoHomeTitle") : `${title} — ${t("brand")}`;
    const description =
      page === "report"
        ? reportText[code].intro
        : page === "blog"
          ? (post ? post.text[code].summary : t("blogBody"))
          : t(({ home: "seoHomeBody", features: "featuresBody", project: "projectBody", download: "downloadBody", guide: "helpBody", "404": "notFoundBody", legal: "legalIntro" } as const)[page as "home"]);
    const meta = (selector: string, value: string) =>
      document.querySelector(selector)?.setAttribute("content", value);
    meta('meta[name="description"]', description);
    meta('meta[property="og:title"]', document.title);
    meta('meta[property="og:description"]', description);
    meta('meta[property="og:url"]', canonicalUrl(localizedPath(path, code)));
    // one canonical URL per page and language, plus its alternates
    document.querySelectorAll("link[data-seo]").forEach((node) => node.remove());
    if (page !== "404") {
      const add = (rel: string, url: string, hreflang?: string) => {
        const link = document.createElement("link");
        link.rel = rel;
        link.href = url;
        if (hreflang) link.hreflang = hreflang;
        link.dataset.seo = "";
        document.head.append(link);
      };
      add("canonical", canonicalUrl(localizedPath(path, code)));
      for (const locale of LOCALES)
        add("alternate", canonicalUrl(localizedPath(path, locale.code)), locale.code);
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
    const popped = () => {
      const next = splitLocale(location.pathname).language ?? "en";
      setLanguageSignal(next);
    };
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
    parts.forEach((part) => observer.observe(part));
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
    dialog.showModal();
  }
  function AppAction(props: { class?: string; arrow?: boolean; label?: Label }) {
    const cls = () => `button ${props.class || "button-primary"}`;
    const text = () => t(props.label ?? "open");
    return (
      <Show
        when={appUrl}
        fallback={
          <button type="button" class={cls()} onClick={openAvailability}>
            {text()}
            {props.arrow !== false && <Icon name="arrow" class="directional" />}
          </button>
        }
      >
        <a class={cls()} href={appUrl!} target="_blank" rel="noopener noreferrer">
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
    function show() {
      setFocus(LOCALES.findIndex((locale) => locale.code === language()));
      setOpen(true);
      queueMicrotask(() => list?.focus());
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
        if (open() && !root.contains(event.target as Node)) hide(false);
      };
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
          <span lang={current().code}>{current().name}</span>
        </button>
        <Show when={open()}>
          <div
            ref={list}
            id={`${props.id}-list`}
            classList={{ "language-list": true, "opens-up": !!props.up }}
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
                  lang={locale.code}
                  dir={locale.dir}
                  onPointerEnter={() => setFocus(index())}
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
        </Show>
      </div>
    );
  }
  function FAQ() {
    return (
      <div class="faq-list">
        <For each={faqs}>
          {(item, index) => (
            <details open={index() === 0} data-rise>
              <summary>
                <span>{l(item.question)}</span>
                <Icon name="plus" class="faq-sign" />
              </summary>
              <p>{l(item.answer)}</p>
            </details>
          )}
        </For>
      </div>
    );
  }
  /**
   * A real screen of the app. Both theme captures are in the page and CSS shows
   * the one matching the site theme. `in` shows it in another language.
   */
  function Shot(props: { view: View; alt: Label; eager?: boolean; phone?: boolean; theme?: "dark" | "light"; in?: Language }) {
    const code = () => props.in ?? language();
    const file = (shade: "dark" | "light", phone = false) => {
      const name = `${code()}-${props.view}${phone ? "-phone" : ""}-${shade}.jpg`;
      const version = PRODUCT_VERSIONS[name];
      return `/assets/product/${name}${version ? `?v=${version}` : ""}`;
    };
    const hasPhone = () => PHONE_VIEWS.includes(props.view);
    const shades = () => (props.theme ? [props.theme] : (["dark", "light"] as const));
    return (
      <figure
        classList={{
          "product-shot": true,
          "phone-shot": !!props.phone,
          "fixed-theme": !!props.theme,
          "shot-rtl": code() === "ar",
          [`shot-${props.view}`]: true,
        }}
      >
        <For each={shades()}>
          {(shade) => (
            <picture class={`shot-${shade}`}>
              {!props.phone && hasPhone() && (
                <source media="(max-width: 600px)" srcset={file(shade, true)} />
              )}
              <img
                src={file(shade, !!props.phone)}
                alt={t(props.alt)}
                width={props.phone ? 780 : 2304}
                height={props.phone ? 1688 : 1440}
                loading={props.eager ? "eager" : "lazy"}
                fetchpriority={props.eager && shade === theme() ? "high" : undefined}
                decoding="async"
              />
            </picture>
          )}
        </For>
      </figure>
    );
  }
  function Languages() {
    const phones = () =>
      [...LOCALES].sort((a, b) => Number(b.code === language()) - Number(a.code === language()));
    const altOf = { ar: "langAltAr", en: "langAltEn", de: "langAltDe" } as const;
    return (
      <section class="languages home-screen" id="languages" aria-labelledby="languages-title">
        <div class="container languages-grid">
          <div class="languages-copy" data-rise>
            <h2 id="languages-title">{t("langTitle")}</h2>
            <p>{t("langBody")}</p>
          </div>
          {/* the flock greets in each language, one after another */}
          <div class="flock-stage home-greet" data-flock="word" data-words="أهلًا|Hello|Hallo" aria-hidden="true" />
          <div class="languages-phones" data-rise>
            <For each={phones()}>
              {(locale) => <Shot view="chat" alt={altOf[locale.code]} phone in={locale.code} />}
            </For>
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
            <div class="home-light home-light-end" aria-hidden="true" />
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
  function Chapter(props: { id: string; title: string; body: string; points?: Label[]; flip?: boolean; phone?: boolean; children: JSX.Element }) {
    return (
      <section class="home-screen" id={props.id} aria-labelledby={`${props.id}-title`}>
        {/* the words in their box at the start side, the picture large and free beside it:
            in Arabic the box is on the right and the picture on the left, in English the reverse */}
        <div classList={{ "home-row": true, "home-with-phone": !!props.phone }} data-rise>
          <div class="home-copy home-card">
            <h2 id={`${props.id}-title`}>{props.title}</h2>
            <p>{props.body}</p>
            <Show when={props.points}>{(points) => <Points class="home-points" items={points()} />}</Show>
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
  /**
   * A call as the app draws it: the shared screen on top, the people under it
   * (who speaks has the ring), and the call's own buttons. A picture of the
   * app, not a working call: the buttons are drawn, not focusable.
   */
  function VoiceCall() {
    const people = [
      { name: "demoPeople1", tone: "a", speaking: true },
      { name: "demoPeople2", tone: "you", speaking: false },
      { name: "demoPeople3", tone: "b", speaking: false },
    ] as const;
    return (
      <figure
        class="voice-call"
        role="img"
        aria-label={`${t("demoLounge")}, ${t("voiceConnected")}, ${t("demoPeople1")} ${t("voiceSharing")}`}
      >
        <div class="call-bar" aria-hidden="true">
          <Icon name="headphones" />
          <strong>{t("demoLounge")}</strong>
          <span>{t("voiceConnected")}</span>
          <span class="call-live"><span class="live-dot" />{t("voiceLive")}</span>
        </div>
        <div class="call-screen" aria-hidden="true">
          <Shot view="lobby" alt="lobbyAlt" />
          <span class="hero-chip call-sharing">{t("demoPeople1")}: {t("voiceSharing")}</span>
        </div>
        <div class="call-people" aria-hidden="true">
          <For each={people}>
            {(person) => (
              <div classList={{ "call-person": true, speaking: person.speaking }}>
                <span class={`call-avatar call-avatar-${person.tone}`} />
                <span>{t(person.name)}</span>
              </div>
            )}
          </For>
        </div>
        <div class="call-controls" aria-hidden="true">
          <span class="call-round" title={t("voiceMute")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
          </span>
          <span class="call-round" title={t("voiceShareScreen")}><Icon name="monitor" /></span>
          <span class="call-leave">{t("voiceLeave")}</span>
        </div>
      </figure>
    );
  }
  function Home() {
    return (
      <>
        {/* the first screen: the headline, its line and the two buttons on the
            start side, the flock writing the name beside them on the end side,
            and the real window under both */}
        <section class="home-hero" aria-labelledby="hero-title">
          <div class="home-light" aria-hidden="true" />
          <div class="container home-hero-top">
            <div class="home-hero-words">
              <h1 id="hero-title">{t("heroTitle")}</h1>
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
              <Shot view="chat" alt="chatAlt" eager />
            </div>
          </div>
        </section>
        <Band />
        {/* three main services only, with room between them */}
        <Chapter id="servers" title={t("serversTitle")} body={t("serversBody")} points={["serversP1", "serversP2", "serversP3"]}>
          <Shot view="lobby" alt="lobbyAlt" />
        </Chapter>
        <section class="home-screen home-voice" id="voice" aria-labelledby="voice-title">
          {/* the flock leaves the name and becomes the sound of the call */}
          <div class="flock-stage voice-stage home-wave" data-flock="wave" data-tone="voice" aria-hidden="true" />
          <div class="home-row" data-rise>
            <div class="home-copy home-card">
              <h2 id="voice-title">{t("voiceTitle")}</h2>
              <p>{t("voiceBody")}</p>
              <Points class="home-points" items={["voiceP1", "voiceP2", "voiceP3"]} />
            </div>
            <div class="home-media"><VoiceCall /></div>
          </div>
        </section>
        <Chapter id="roles" title={l(features[3].title)} body={l(features[3].body)} points={["rolesP1", "rolesP2", "rolesP3"]}>
          <Shot view="settings" alt="commAlt" />
        </Chapter>
        <Languages />
        {/* the reasons, each a title and one line */}
        <section class="home-screen home-why" id="why" aria-labelledby="why-title">
          <div class="container">
            <h2 id="why-title" data-rise>{t("whyTitle")}</h2>
            <div class="home-why-grid" data-rise>
              <For each={["why1", "why2", "why3", "why4"] as const}>
                {(key) => (
                  <article>
                    <h3>{t(key)}</h3>
                    <p>{t(`${key}Body` as Label)}</p>
                  </article>
                )}
              </For>
            </div>
            <a class="text-link home-why-link" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              {t("homeOpenSource")}
              <Icon name="arrow" class="directional" />
            </a>
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
              <div class="home-light home-light-end" aria-hidden="true" />
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
  /** What proves a feature: a real screen, the live voice list, or the source */
  function FeatureProof(props: { view: (typeof features)[number]["view"] }) {
    return (
      <Switch>
        <Match when={props.view === "lobby"}>
          <Shot view="lobby" alt="lobbyAlt" />
        </Match>
        <Match when={props.view === "voice"}>
          <VoiceChannels t={t} />
        </Match>
        <Match when={props.view === "chat"}>
          <Shot view="chat" alt="chatAlt" />
        </Match>
        <Match when={props.view === "settings"}>
          <Shot view="settings" alt="commAlt" />
        </Match>
        <Match when={props.view === "roles"}>
          <Shot view="roles" alt="rolesAlt" />
        </Match>
        <Match when={props.view === "discover"}>
          <Shot view="discover" alt="discoverAlt" />
        </Match>
        <Match when={props.view === "light"}>
          <Shot view="chat" alt="chatAlt" theme={theme() === "dark" ? "light" : "dark"} />
        </Match>
        <Match when={props.view === "code"}>
          <pre class="source-card" dir="ltr">
            <code>{"github.com/zrzur\n\nAGPL-3.0"}</code>
          </pre>
        </Match>
      </Switch>
    );
  }
  /**
   * Every feature as a card on one grid: wide and narrow cards take turns
   * (7 + 5, then 5 + 7), so the page has a rhythm; each card shows its proof.
   */
  function Features() {
    const wide = (index: number) => [0, 3, 4, 6].includes(index);
    return (
      <>
        <PageHeading title="featuresTitle" body="featuresBody" words="#" />
        <section class="container feature-grid" aria-label={t("features")}>
          <For each={features}>
            {(feature, index) => (
              <article
                id={feature.id}
                classList={{ "feature-tile": true, "feature-wide": wide(index()), [`feature-${feature.view}`]: true }}
                data-rise
              >
                <span class="feature-icon" aria-hidden="true"><Icon name={feature.icon} /></span>
                <h2>{l(feature.title)}</h2>
                <p>{l(feature.body)}</p>
                <div class="feature-proof">
                  <FeatureProof view={feature.view} />
                </div>
              </article>
            )}
          </For>
        </section>
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
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              {t("source")}
              <Icon name="arrowDiagonal" />
            </a>
            <a href={href("/legal")}>
              {t("licences")}
              <Icon name="arrow" class="directional" />
            </a>
            <a href={`${import.meta.env.BASE_URL}${THIRD_PARTY_NOTICES_PATH}`} target="_blank" rel="noopener noreferrer">
              {t("thirdParty")}
              <Icon name="arrowDiagonal" />
            </a>
          </nav>
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
  /** The desktop app for Windows, macOS and Linux, and the browser beside it */
  function Download() {
    const yours = visitorSystem();
    const systems = [
      { id: "windows", name: "Windows", meta: "dlWindowsMeta", how: "dlWindowsHow" },
      { id: "mac", name: "macOS", meta: "dlMacMeta", how: "dlMacHow" },
      { id: "linux", name: "Linux", meta: "dlLinuxMeta", how: "dlLinuxHow" },
    ] as const;
    const size = (mb: number) => t("dlSize").replace("{size}", String(mb));
    return (
      <>
        <PageHeading title="downloadTitle" body="downloadBody" words={t("flockName")} />
        <section class="container download-systems" aria-label={t("navDownload")}>
          <For each={systems}>
            {(system) => (
              <article classList={{ "download-card": true, "is-yours": system.id === yours }} id={system.id} data-rise>
                <Show when={system.id === yours}>
                  <p class="download-yours">{t("dlYours")}</p>
                </Show>
                <h2 dir="ltr">{system.name}</h2>
                <p class="download-meta">{t(system.meta)}</p>
                <div class="download-buttons">
                  <For each={DESKTOP_DOWNLOADS[system.id]}>
                    {(file, index) => (
                      <a
                        classList={{ button: true, "button-primary": system.id === yours && index() === 0, "button-soft": !(system.id === yours && index() === 0) }}
                        href={file.url}
                        download=""
                      >
                        <Icon name="download" />
                        <span>{t(file.label)}</span>
                        <span class="download-size">{size(file.size)}</span>
                      </a>
                    )}
                  </For>
                </div>
                <p class="download-how">{t(system.how)}</p>
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
              </article>
            )}
          </For>
        </section>
        <section class="container download-web">
          <div class="download-card download-browser" data-rise>
            <div>
              <h2 dir="ltr">app.zrzur.com</h2>
              <p>{t("heroFacts")}</p>
            </div>
            <AppAction class="button-soft" label="downloadOpenWeb" arrow={false} />
          </div>
          <p class="download-version">
            {t("dlVersion").split("{version}")[0]}
            <span dir="ltr">{DESKTOP_VERSION}</span>
            {t("dlVersion").split("{version}")[1]}
          </p>
        </section>
        <section class="container web-only">
          <div>
            <h2>{t("trustTitle")}</h2>
            <p>{t("trustBody")}</p>
          </div>
        </section>
      </>
    );
  }
  /** The blog: the list of posts, or one post with its own heading */
  function Blog() {
    const date = (iso: string) =>
      new Intl.DateTimeFormat(language(), { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${iso}T12:00:00Z`));
    const minutes = (n: number) => t("blogMinutes").replace("{n}", new Intl.NumberFormat(language()).format(n));
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
    const Card = (props: { entry: Post }) => (
      <article class="blog-card" data-rise>
        <p class="blog-meta">
          <time dateTime={props.entry.date}>{date(props.entry.date)}</time>
          <span>{minutes(props.entry.minutes[language()])}</span>
        </p>
        <h2>
          <a href={href(`/blog/${props.entry.slug}`)}>{props.entry.text[language()].title}</a>
        </h2>
        <p>{props.entry.text[language()].summary}</p>
        <a class="text-link" href={href(`/blog/${props.entry.slug}`)}>
          {t("blogRead")}
          <Icon name="arrow" class="directional" />
        </a>
      </article>
    );
    return (
      <Show
        when={post}
        fallback={
          <>
            <PageHeading title="blogTitle" body="blogBody" words={t("flockName")} />
            <section class="container blog-list" aria-label={t("blog")}>
              <Show when={posts.length} fallback={<p>{t("blogEmpty")}</p>}>
                <For each={posts}>{(entry) => <Card entry={entry} />}</For>
              </Show>
              <a class="text-link blog-feed" href={feed()}>{t("blogFeed")}</a>
            </section>
          </>
        }
      >
        {(entry) => {
          const text = () => entry().text[language()];
          const sections = () => text().blocks.flatMap((block) => (block.kind === "h2" ? [block] : []));
          const others = () => posts.filter((other) => other.slug !== entry().slug).slice(0, 2);
          return (
            <>
              <article class="container blog-post">
                <a class="text-link blog-back" href={href("/blog")}>
                  <Icon name="arrow" class="directional blog-back-icon" />
                  {t("blogBack")}
                </a>
                <p class="blog-meta">
                  <time dateTime={entry().date}>{date(entry().date)}</time>
                  <span>{minutes(entry().minutes[language()])}</span>
                  <span>{t("blogBy")}</span>
                </p>
                <h1>{text().title}</h1>
                <p class="blog-lead">{text().summary}</p>
                <Show when={entry().cover}>
                  {(cover) => <img class="blog-cover" src={cover()} alt="" width="1200" height="630" />}
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
              <span class="footer-language-label" id="footer-language-label">{t("language")}</span>
              <div class="footer-controls">
                <LanguageMenu id="footer-language" up />
                <ThemeToggle />
              </div>
            </div>
            <div class="footer-columns">
              {column("footerProduct", [
                { href: href("/features"), label: t("features") },
                { href: appUrl, label: t("open"), external: true, onClick: openAvailability },
                ...(discoverUrl ? [{ href: discoverUrl, label: t("discover"), external: true }] : []),
              ])}
              {column("footerProject", [
                { href: href("/project"), label: t("project") },
                { href: SOURCE_URL, label: t("source"), external: true },
                { href: href("/project#source"), label: t("licences") },
                { href: `${import.meta.env.BASE_URL}${THIRD_PARTY_NOTICES_PATH}`, label: t("thirdParty"), external: true },
              ])}
              {column("footerResources", [
                { href: href("/blog"), label: t("blog") },
                { href: href("/guide"), label: t("gettingStarted") },
                { href: href("/guide#faq"), label: t("questions") },
                { href: href("/legal/community-guidelines"), label: t("safety") },
                { href: SUPPORT_MAIL, label: t("feedback") },
              ])}
              {column("footerLegal", [
                ...legalFooterLinks.filter((link) => link.slug !== "paid-services").map((link) => ({ href: href(`/legal/${link.slug}`), label: l(link.label) })),
                { href: href("/legal"), label: t("allPolicies") },
                { href: href("/report"), label: reportText[language()].title },
              ])}
            </div>
          </div>
          <div class="footer-bottom">
            <span class="footer-copy">{t("copyright")}</span>
            <span>{t("footerAttribution")}</span>
            <span class="footer-draft">{t("draftNote")}</span>
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
            <Show when={discoverUrl}>
              <a href={discoverUrl!} target="_blank" rel="noopener noreferrer">
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
            <LegalPage language={language()} path={path} />
          </Show>
          <Show when={page === "report"}>
            <ReportPage language={language()} />
          </Show>
        </Suspense>
        <Show when={page === "404"}>
          <NotFound />
        </Show>
      </main>
      <Footer />
      <dialog ref={dialog} class="site-dialog" aria-labelledby="dialog-title">
        <button
          type="button"
          class="icon-button dialog-close"
          aria-label={t("close")}
          onClick={() => dialog.close()}
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
    </>
  );
}
