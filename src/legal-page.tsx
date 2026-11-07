import { For, Show, createEffect } from "solid-js";

import { labels, localize, type Label, type Partial } from "./content";
import { Icon } from "./icon";
import { localizedPath, type Language } from "./i18n";
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
export default function LegalPage(props: { language: Language; path: string }) {
  const legalDoc = legalDocuments.find((doc) => props.path === `/legal/${doc.slug}`);
  const language = () => props.language;
  const t = (key: Label) => labels[language()][key];
  const l = (value: Partial) => localize(value, language());
  const href = (target: string) => localizedPath(target, language());
  createEffect(() => {
    if (legalDoc) document.title = `${l(legalDoc.title)} — ${t("brand")}`;
  });

  function Page() {
    // the policy bodies exist in English and Arabic; other languages say so
    const fallback = () => language() !== "en" && language() !== "ar";
    return (
      <>
        <header class="page-heading page-heading-quiet container">
          <div>
            <h1>{legalDoc ? l(legalDoc.title) : t("legalTitle")}</h1>
            <p>{legalDoc ? l(legalDoc.intro) : t("legalIntro")}</p>
          </div>
        </header>
        <Show when={legalDoc} fallback={<Index />}>
          <section class="container legal-layout">
            <aside class="legal-navigation">
              <h2>{t("documents")}</h2>
              <For each={legalGroups}>
                {(group) => (
                  <>
                    <h3>{l(group.title)}</h3>
                    <For each={legalDocuments.filter((doc) => doc.group === group.id)}>
                      {(doc) => (
                        <a href={href(`/legal/${doc.slug}`)} aria-current={doc === legalDoc ? "page" : undefined}>
                          {l(doc.title)}
                        </a>
                      )}
                    </For>
                  </>
                )}
              </For>
            </aside>
            <div class="legal-content" lang={fallback() ? "en" : undefined}>
              <Banner fallback={fallback()} />
              <Show when={legalDoc}>
                {(doc) => (
                  <>
                    <nav class="legal-toc" aria-label={t("docContents")}>
                      <For each={doc().sections}>
                        {(section) => <a href={`#${section.id}`}>{l(section.title)}</a>}
                      </For>
                    </nav>
                    <For each={doc().sections}>
                      {(section, index) => (
                        <section id={section.id} class="legal-section">
                          <span class="section-index">{index() + 1}</span>
                          <div>
                            <h2>{l(section.title)}</h2>
                            <LegalBody text={l(section.body)} />
                          </div>
                        </section>
                      )}
                    </For>
                    <Show when={doc().sources.length > 0}>
                      <div class="legal-sources">
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
                  </>
                )}
              </Show>
            </div>
          </section>
        </Show>
      </>
    );
  }
  function Banner(props: { fallback: boolean }) {
    return (
      <div class="legal-draft" role="note">
        <Icon name="shield" />
        <p>
          <strong>{l(legalDoc?.banner ?? legalDraftNotice)}</strong>
          <Show when={props.fallback}>
            <span class="legal-updated" lang={language()}>{t("legalLanguageNote")}</span>
          </Show>
          <Show when={legalDoc}>
            {(doc) => <span class="legal-updated">{l(doc().lastUpdated)}</span>}
          </Show>
        </p>
      </div>
    );
  }
  /** The index of policies: each group is a shelf, each document one line */
  function Index() {
    return (
      <section class="container legal-shelves">
        <Banner fallback={false} />
        <For each={legalGroups}>
          {(group) => (
            <section class="legal-shelf">
              <h2>{l(group.title)}</h2>
              <div class="legal-index">
                <For each={legalDocuments.filter((doc) => doc.group === group.id)}>
                  {(doc) => (
                    <a href={href(`/legal/${doc.slug}`)}>
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
