import { For, Show, createEffect } from "solid-js";

import { localize, type Label, type Partial } from "./content";
import { Icon } from "./icon";
import { BINDING_LANGUAGES, localizedPath, tagOf, type Language } from "./i18n";
import { bindingNotice, shownLanguage } from "./legal-binding";
import { legalDocuments, legalDraftNotice, legalGroups } from "./legal";

const MAIL = /([a-z]+@zrzur.com|zrzur@proton.me)/g;

function ContactText(props: { text: string }) {
  return <For each={props.text.split(MAIL)}>{(part) =>
    /^([a-z]+@zrzur.com|zrzur@proton.me)$/.test(part) ? <a href={`mailto:${part}`} dir="ltr">{part}</a> : part
  }</For>;
}

/** Renders a policy body: blank lines split blocks, "- " lines form a list. */
function LegalBody(props: { text: string }) {
  const blocks = () =>
    props.text.split(/\n{2,}/).map((block) => {
      const lines = block.split("\n");
      return lines.every((line) => line.startsWith("- "))
        ? { list: lines.map((line) => line.slice(2)) }
        : { text: block };
    });
  return (
    <For each={blocks()}>
      {(block) =>
        block.list ? (
          <ul>
            <For each={block.list}>{(item) => <li><ContactText text={item} /></li>}</For>
          </ul>
        ) : (
          <p><ContactText text={block.text!} /></p>
        )
      }
    </For>
  );
}

/** The legal hub and every policy; split from the first load, the text stays as written */
export default function LegalPage(props: { language: Language; path: string; t: (key: Label) => string }) {
  const legalDoc = legalDocuments.find((doc) => props.path === `/legal/${doc.slug}`);
  const language = () => props.language;
  const t = (key: Label) => props.t(key);
  /** Titles and intros: the page language where it exists, else English */
  const l = (value: Partial) => localize(value, language());
  /** The policy text: all of it in the page language, or all of it in English */
  const shown = () => (legalDoc ? shownLanguage(legalDoc, language()) : language());
  const body = (value: Partial) => localize(value, shown());
  const href = (target: string) => localizedPath(target, language());
  const notice = () => (legalDoc ? bindingNotice(legalDoc, language()) : null);
  createEffect(() => {
    if (legalDoc) document.title = `${l(legalDoc.title)} — ${t("brand")}`;
  });

  function Page() {
    return (
      <>
        <header class="page-heading page-heading-quiet container">
          <div>
            <h1 lang={legalDoc && !legalDoc.title[language()] ? "en" : undefined}>{legalDoc ? l(legalDoc.title) : t("legalTitle")}</h1>
            <p lang={legalDoc && !legalDoc.intro[language()] ? "en" : undefined}>{legalDoc ? l(legalDoc.intro) : t("legalIntro")}</p>
          </div>
        </header>
        <Show when={legalDoc} fallback={<Index />}>
          <section class="container legal-layout">
            <aside class="legal-navigation">
              <h2>{t("documents")}</h2>
              <For each={legalGroups}>
                {(group) => (
                  <>
                    <h3>{t(group.title)}</h3>
                    <For each={legalDocuments.filter((doc) => doc.group === group.id)}>
                      {(doc) => (
                        <a
                          href={href(`/legal/${doc.slug}`)}
                          aria-current={doc === legalDoc ? "page" : undefined}
                          lang={doc.title[language()] ? undefined : "en"}
                        >
                          {l(doc.title)}
                        </a>
                      )}
                    </For>
                  </>
                )}
              </For>
            </aside>
            <div class="legal-content">
              <Binding />
              <Banner />
              <Show when={legalDoc}>
                {(doc) => (
                  <div lang={shown() !== language() ? tagOf(shown()) : undefined}>
                    <nav class="legal-toc" aria-label={t("docContents")}>
                      <For each={doc().sections}>
                        {(section) => <a href={`#${section.id}`}>{body(section.title)}</a>}
                      </For>
                    </nav>
                    <For each={doc().sections}>
                      {(section, index) => (
                        <section id={section.id} class="legal-section">
                          <span class="section-index">{index() + 1}</span>
                          <div>
                            <h2>{body(section.title)}</h2>
                            <LegalBody text={body(section.body)} />
                          </div>
                        </section>
                      )}
                    </For>
                    <Show when={doc().sources.length > 0}>
                      <div class="legal-sources" lang={tagOf(language())}>
                        <h2>{t("draftSources")}</h2>
                        <p>{t("draftSourcesBody")}</p>
                        <For each={doc().sources}>
                          {(url) => (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              {url.replace("https://", "")}
                            </a>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                )}
              </Show>
            </div>
          </section>
        </Show>
      </>
    );
  }
  /**
   * On a page that is not a binding version: what this page is, which
   * versions bind, and a link to each of them (owner brief 2026-11-10).
   */
  function Binding() {
    return (
      <Show when={notice()}>
        {(info) => (
          <div class="legal-binding" role="note" id="legal-binding">
            <Icon name="globe" />
            <div>
              <p>
                <strong>{t(info().kind === "translation" ? "legalTranslationNote" : "legalEnglishNote")}</strong>{" "}
                {t(info().binding.includes("de") ? "legalBindingEnDe" : "legalBindingEn")}
              </p>
              <p class="legal-binding-links">
                <For each={info().binding.filter((code) => info().kind === "translation" || code !== "en")}>
                  {(code) => (
                    <a href={localizedPath(props.path, code)} hreflang={tagOf(code)} data-binding={code}>
                      {t(code === "de" ? "legalReadGerman" : "legalReadEnglish")}
                      <Icon name="arrow" class="directional" />
                    </a>
                  )}
                </For>
              </p>
            </div>
          </div>
        )}
      </Show>
    );
  }
  function Banner() {
    return (
      <div class="legal-draft" role="note">
        <Icon name="shield" />
        <p>
          <strong lang={legalDoc && shown() !== language() ? tagOf(shown()) : undefined}>
            {legalDoc ? body(legalDoc.banner) : l(legalDraftNotice)}
          </strong>
          <Show when={legalDoc}>
            {(doc) => <span class="legal-updated" lang={shown() !== language() ? tagOf(shown()) : undefined}>{body(doc().lastUpdated)}</span>}
          </Show>
        </p>
      </div>
    );
  }
  /** The index of policies: each group is a shelf, each document one line */
  function Index() {
    return (
      <section class="container legal-shelves">
        <Show when={!BINDING_LANGUAGES.includes(language())}>
          <div class="legal-binding" role="note" id="legal-binding">
            <Icon name="globe" />
            <div>
              <p>{t("legalHubNote")}</p>
              <p class="legal-binding-links">
                <For each={BINDING_LANGUAGES}>
                  {(code) => (
                    <a href={localizedPath("/legal", code)} hreflang={tagOf(code)} data-binding={code}>
                      {t(code === "de" ? "legalReadGerman" : "legalReadEnglish")}
                      <Icon name="arrow" class="directional" />
                    </a>
                  )}
                </For>
              </p>
            </div>
          </div>
        </Show>
        <Banner />
        <For each={legalGroups}>
          {(group) => (
            <section class="legal-shelf">
              <h2>{t(group.title)}</h2>
              <div class="legal-index">
                <For each={legalDocuments.filter((doc) => doc.group === group.id)}>
                  {(doc) => (
                    <a href={href(`/legal/${doc.slug}`)} lang={doc.title[language()] ? undefined : "en"}>
                      <h3>{l(doc.title)}</h3>
                      <p>{l(doc.intro)}</p>
                      <Icon name="arrow" class="directional" />
                    </a>
                  )}
                </For>
              </div>
            </section>
          )}
        </For>
      </section>
    );
  }

  return <Page />;
}
