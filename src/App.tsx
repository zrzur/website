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
import { canonicalUrl, resolveAppUrl, validatePublicUrl } from "./config";
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

type Page =
  | "home"
  | "features"
  | "project"
  | "download"
  | "guide"
  | "legal"
  | "report"
  | "404";
const pageForPath = (path: string): Page => {
  if (
    path === "/legal" ||
    legalSlugs.some((slug) => path === `/legal/${slug}`)
  )
    return "legal";
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

/** Views captured from the running app */
type View = "chat" | "lobby" | "discover" | "settings" | "roles";
const PHONE_VIEWS: readonly View[] = ["chat", "lobby"];

// the long legal texts and the report form load only on their own pages
const LegalPage = lazy(() => import("./legal-page"));
const ReportPage = lazy(() => import("./report"));

/** The pages where the flock flies; legal and report pages stay quiet */
const FLOCK_PAGES: readonly Page[] = ["home", "features", "project", "guide", "download", "404"];

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
    validatePublicUrl(import.meta.env.VITE_PUBLIC_DISCOVER_URL) ??
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
        : page === "home"
          ? t("heroTitle")
          : t(({ features: "features", project: "project", download: "downloadTitle", guide: "help", "404": "notFound" } as const)[page]);
    document.title = `${title} — ${t("brand")}`;
    const description = page === "report" ? reportText[code].intro : t(
      ({ home: "heroBody", features: "featuresBody", project: "projectBody", download: "downloadBody", guide: "helpBody", "404": "notFoundBody", legal: "legalIntro" } as const)[page],
    );
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
    const update = () => setScrolled(window.scrollY > 15);
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
      <dl class="faq-list">
        <For each={faqs}>
          {(item) => (
            <div data-rise>
              <dt>{l(item.question)}</dt>
              <dd>{l(item.answer)}</dd>
            </div>
          )}
        </For>
      </dl>
    );
  }
  /**
   * A real screen of the app. Both theme captures are in the page and CSS shows
   * the one matching the site theme. `in` shows it in another language.
   */
  function Shot(props: { view: View; alt: Label; eager?: boolean; phone?: boolean; theme?: "dark" | "light"; in?: Language }) {
    const code = () => props.in ?? language();
    const file = (shade: "dark" | "light", phone = false) =>
      `/assets/product/${code()}-${props.view}${phone ? "-phone" : ""}-${shade}.jpg`;
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
                width={props.phone ? 780 : 2160}
                height={props.phone ? 1688 : 1350}
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
  /** Tabs built like the app's own channel list: pick a place, see that screen */
  function Tour() {
    const [current, setCurrent] = createSignal(0);
    const buttons: HTMLButtonElement[] = [];
    function keys(event: KeyboardEvent) {
      const rtl = document.documentElement.dir === "rtl";
      const next = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
      if (!next) return;
      event.preventDefault();
      const to = (current() + next + TOUR.length) % TOUR.length;
      setCurrent(to);
      buttons[to]?.focus();
    }
    return (
      <section class="tour" id="tour" aria-labelledby="tour-title">
        <div class="container tour-head" data-rise>
          <h2 id="tour-title">{t("tourTitle")}</h2>
          <p>{t("tourBody")}</p>
        </div>
        <div class="container tour-body">
          <div class="tour-side" data-rise>
            <div class="tour-tabs" role="tablist" aria-label={t("tourLabel")} aria-orientation="vertical" onKeyDown={keys}>
              <For each={TOUR}>
                {(item, index) => (
                  <button
                    ref={(el) => (buttons[index()] = el)}
                    type="button"
                    role="tab"
                    id={`tour-tab-${item.id}`}
                    aria-selected={current() === index()}
                    aria-controls="tour-panel"
                    tabindex={current() === index() ? 0 : -1}
                    onClick={() => setCurrent(index())}
                  >
                    <Icon name={index() === 0 ? "community" : index() === 1 ? "hash" : index() === 2 ? "shield" : index() === 3 ? "users" : "compass"} />
                    {t(item.label)}
                  </button>
                )}
              </For>
            </div>
            <p class="tour-line" aria-live="polite">
              {t(TOUR[current()].body)}
            </p>
          </div>
          <div class="tour-stage" id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${TOUR[current()].id}`} tabindex="0" data-rise>
            <Switch>
              <Match when={current() === 0}>
                <Shot view="lobby" alt="lobbyAlt" />
              </Match>
              <Match when={current() === 1}>
                <Shot view="chat" alt="chatAlt" />
              </Match>
              <Match when={current() === 2}>
                <Shot view="settings" alt="commAlt" />
              </Match>
              <Match when={current() === 3}>
                <Shot view="roles" alt="rolesAlt" />
              </Match>
              <Match when={current() === 4}>
                <Shot view="discover" alt="discoverAlt" />
              </Match>
            </Switch>
          </div>
        </div>
      </section>
    );
  }
  function Voice() {
    return (
      <section class="voice" id="voice" aria-labelledby="voice-title">
        <div class="container voice-head" data-rise>
          <h2 id="voice-title">{t("voiceTitle")}</h2>
          <p>{t("voiceBody")}</p>
        </div>
        <div class="flock-stage voice-stage" data-flock="wave" data-tone="voice" aria-hidden="true" />
        <ul class="container voice-points" data-rise>
          <For each={["voiceP1", "voiceP2", "voiceP3"] as const}>
            {(point) => <li>{t(point)}</li>}
          </For>
        </ul>
      </section>
    );
  }
  function Languages() {
    const phones = () =>
      [...LOCALES].sort((a, b) => Number(b.code === language()) - Number(a.code === language()));
    const altOf = { ar: "langAltAr", en: "langAltEn", de: "langAltDe" } as const;
    return (
      <section class="languages" id="languages" aria-labelledby="languages-title">
        <div class="container languages-grid">
          <div class="languages-copy" data-rise>
            <h2 id="languages-title">{t("langTitle")}</h2>
            <p>{t("langBody")}</p>
            <div class="flock-stage languages-stage" data-flock="word" data-words={t("langGreeting")} aria-hidden="true" />
          </div>
          <div class="languages-phones" data-rise>
            <For each={phones()}>
              {(locale) => <Shot view="chat" alt={altOf[locale.code]} phone in={locale.code} />}
            </For>
          </div>
        </div>
      </section>
    );
  }
  function Open() {
    return (
      <section class="open" id="open-source" aria-labelledby="open-title">
        <div class="container open-grid">
          <h2 id="open-title" data-rise>{t("openTitle")}</h2>
          <div data-rise>
            <p>{t("openBody")}</p>
            <ul>
              <For each={["openP1", "openP2", "openP3"] as const}>
                {(point) => (
                  <li>
                    <Icon name="check" />
                    {t(point)}
                  </li>
                )}
              </For>
            </ul>
            <a class="text-link" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              {t("source")}
              <Icon name="arrow" class="directional" />
            </a>
          </div>
        </div>
      </section>
    );
  }
  function CTA() {
    return (
      <section class="closing container" aria-labelledby="closing-title">
        <h2 id="closing-title" data-rise>{t("ctaTitle")}</h2>
        <div data-rise>
          <p>{t("ctaBody")}</p>
          <AppAction />
        </div>
      </section>
    );
  }
  function Home() {
    return (
      <>
        <section class="hero" aria-labelledby="hero-title">
          <div class="flock-stage hero-stage" data-flock="word" data-words={t("flockName")} aria-hidden="true" />
          <div class="container hero-grid">
            <div class="hero-copy">
              <h1 id="hero-title">{t("heroTitle")}</h1>
              <p class="hero-lead">{t("heroBody")}</p>
              <div class="hero-action">
                <AppAction />
                <p>{t("heroFacts")}</p>
              </div>
            </div>
          </div>
        </section>
        <Tour />
        <Voice />
        <Languages />
        <Open />
        <section class="questions container" id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">{t("faqTitle")}</h2>
          <FAQ />
        </section>
        <CTA />
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
            <code>{`git clone ${SOURCE_URL.replace(/\/tree\/.*$/, "")}\n\n# AGPL-3.0`}</code>
          </pre>
        </Match>
      </Switch>
    );
  }
  function Features() {
    const [current, setCurrent] = createSignal(0);
    onMount(() => {
      if (!("IntersectionObserver" in window)) return;
      const rows = [...document.querySelectorAll<HTMLElement>(".feature-row")];
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) setCurrent(rows.indexOf(entry.target as HTMLElement));
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      rows.forEach((row) => observer.observe(row));
      onCleanup(() => observer.disconnect());
    });
    return (
      <>
        <PageHeading title="featuresTitle" body="featuresBody" words="#" />
        <section class="container feature-list" aria-label={t("features")}>
          <div class="feature-rows">
            <For each={features}>
              {(feature, index) => (
                <article id={feature.id} classList={{ "feature-row": true, "is-current": current() === index() }}>
                  <h2>{l(feature.title)}</h2>
                  <p>{l(feature.body)}</p>
                  <ul>
                    <For each={l(feature.detail).split(" · ")}>{(item) => <li>{item}</li>}</For>
                  </ul>
                  <div class="feature-inline">
                    <FeatureProof view={feature.view} />
                  </div>
                </article>
              )}
            </For>
          </div>
          <div class="feature-sticky" aria-hidden="true">
            <For each={features}>
              {(feature, index) => (
                <div classList={{ "feature-frame": true, "is-current": current() === index() }}>
                  <Show when={Math.abs(current() - index()) <= 1}>
                    <FeatureProof view={feature.view} />
                  </Show>
                </div>
              )}
            </For>
          </div>
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
          <h2 data-rise>{t("licensesTitle")}</h2>
          <div data-rise>
            <p>{t("licensesBody")}</p>
            <p class="fine-print">{t("storyNote")}</p>
            <a class="text-link" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              {t("source")}
              <Icon name="arrow" class="directional" />
            </a>
          </div>
        </section>
        <section class="container feedback-section">
          <h2 data-rise>{t("projectFeedbackTitle")}</h2>
          <div data-rise>
            <p>{t("projectFeedbackBody")}</p>
            <a class="text-link" href={SUPPORT_MAIL}>
              {t("feedback")}
              <Icon name="arrow" class="directional" />
            </a>
          </div>
        </section>
        <CTA />
      </>
    );
  }
  function Download() {
    return (
      <>
        <PageHeading title="downloadTitle" body="downloadBody" words={t("flockName")} />
        <section class="container web-only">
          <AppAction />
          <div>
            <h2>{t("trustTitle")}</h2>
            <p>{t("trustBody")}</p>
          </div>
        </section>
      </>
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
            <AppAction />
            <a class="text-link" href={href("/legal/community-guidelines")}>
              {t("safety")}
              <Icon name="arrow" class="directional" />
            </a>
          </aside>
        </section>
        <section class="questions container" id="faq" aria-labelledby="faq-title">
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
        <Show when={page === "home"}>
          <div class="flock-stage footer-stage" data-flock="word" data-words={t("flockName")} aria-hidden="true" />
        </Show>
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
              <div class="language-chips" role="group" aria-label={t("language")}>
                <For each={LOCALES}>
                  {(locale) => (
                    <button
                      type="button"
                      lang={locale.code}
                      aria-pressed={locale.code === language()}
                      onClick={() => setLanguage(locale.code)}
                    >
                      {locale.name}
                    </button>
                  )}
                </For>
              </div>
              <AppAction />
            </div>
          </nav>
          <div class="header-actions">
            <div class="header-language">
              <LanguageMenu id="header-language" />
            </div>
            <ThemeToggle />
            <div class="header-cta">
              <AppAction arrow={false} />
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
