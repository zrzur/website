import { For, createSignal, type JSX } from "solid-js";

import type { Label } from "./content";
import { hugeicons as paths } from "./hugeicons";

function Glyph(props: { name: string; class?: string }) {
  return (
    <svg
      class={props.class}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      innerHTML={paths[props.name] || paths.hash}
    />
  );
}

/** The app's default avatar: a soft shape on a pastel disc */
export function Avatar(props: { tone: "a" | "b" | "you" }) {
  return (
    <span class={`app-avatar app-avatar-${props.tone}`} aria-hidden="true">
      <i />
    </span>
  );
}

function Message(props: { tone: "a" | "b" | "you"; name: string; time: string; text: string; class?: string }) {
  return (
    <li class={`app-message ${props.class ?? ""}`}>
      <Avatar tone={props.tone} />
      <div>
        <p class="app-meta">
          <strong classList={{ "app-name-owner": props.tone === "b" }}>{props.name}</strong>
          <span>{props.time}</span>
        </p>
        <p class="app-text" dir="auto">
          {props.text}
        </p>
      </div>
    </li>
  );
}

function Channel(props: { icon?: string; label: string; active?: boolean; unread?: boolean; children?: JSX.Element }) {
  return (
    <li classList={{ "app-channel": true, "is-active": !!props.active, "is-unread": !!props.unread }}>
      <span>
        <Glyph name={props.icon ?? "hash"} />
        {props.label}
      </span>
      {props.children}
    </li>
  );
}

/** Channels of the demo server, shared by the hero window and the voice fragment */
export function VoiceChannels(props: { t: (key: Label) => string }) {
  const t = props.t;
  return (
    <div class="app-voice" data-ui role="img" aria-label={t("voiceAlt")}>
      <p class="app-category">{t("demoVoiceCategory")}</p>
      <ul>
        <Channel icon="headphones" label={t("demoLounge")} />
        <li class="app-voice-person is-speaking">
          <Avatar tone="b" />
          {t("demoPeople2")}
        </li>
        <li class="app-voice-person">
          <Avatar tone="a" />
          {t("demoPeople1")}
        </li>
        <Channel icon="headphones" label={t("demoQuiet")} />
      </ul>
    </div>
  );
}

/**
 * The hero: the real chat screen of the app rebuilt in HTML with the same demo
 * server the screenshots use. Its composer is live: what the visitor sends lands
 * in the channel and the flock writes it. Nothing leaves the page.
 */
export function AppWindow(props: { t: (key: Label) => string; onSay: (text: string) => void }) {
  const t = props.t;
  const [sent, setSent] = createSignal<string[]>([]);
  const [draft, setDraft] = createSignal("");
  let list!: HTMLOListElement;
  let input!: HTMLInputElement;

  function send(event: SubmitEvent) {
    event.preventDefault();
    const text = draft().trim();
    if (!text) {
      input.focus();
      return;
    }
    setSent((old) => [...old.slice(-2), text]);
    setDraft("");
    props.onSay(text);
    queueMicrotask(() => (list.scrollTop = list.scrollHeight));
    // the phone keyboard would hide the word the flock is writing
    if (matchMedia("(pointer: coarse)").matches) input.blur();
  }

  return (
    <figure class="app-window" data-ui aria-label={t("demoAlt")}>
      <nav class="app-rail" aria-hidden="true">
        <span class="app-rail-logo">
          <i class="brand-symbol" />
        </span>
        <span class="app-rail-server">{t("demoInitials")}</span>
        <span class="app-rail-button">
          <Glyph name="plus" />
        </span>
        <span class="app-rail-button">
          <Glyph name="compass" />
        </span>
      </nav>
      <div class="app-sidebar" aria-hidden="true">
        <p class="app-server-name">{t("demoServer")}</p>
        <ul>
          <Channel icon="community" label={t("demoLobby")} />
        </ul>
        <p class="app-category">{t("demoInfo")}</p>
        <ul>
          <Channel label={t("demoAnnouncements")} unread />
          <Channel icon="check" label={t("demoRules")} unread />
        </ul>
        <p class="app-category">{t("demoChatCategory")}</p>
        <ul>
          <Channel label={t("demoChat")} active />
          <Channel label={t("demoSquad")} />
        </ul>
        <p class="app-category">{t("demoVoiceCategory")}</p>
        <ul>
          <Channel icon="headphones" label={t("demoLounge")} />
          <Channel icon="headphones" label={t("demoQuiet")} />
        </ul>
      </div>
      <div class="app-chat">
        <header class="app-chat-top">
          <Glyph name="hash" />
          <strong>{t("demoChat")}</strong>
          <span class="app-chat-tools" aria-hidden="true">
            <Glyph name="users" />
            <Glyph name="search" />
          </span>
        </header>
        <ol class="app-messages" ref={list} aria-live="polite" tabindex="-1">
          <Message tone="a" name={t("demoPeople1")} time={t("demoToday")} text={t("demoMessage1")} />
          <Message tone="b" name={t("demoPeople2")} time={t("demoToday")} text={t("demoMessage2")} />
          <Message tone="a" name={t("demoPeople1")} time={t("demoToday")} text={t("demoMessage3")} />
          <Message tone="b" name={t("demoPeople2")} time={t("demoToday")} text={t("demoMessage4")} />
          <Message tone="a" name={t("demoPeople1")} time={t("demoToday")} text={t("demoMessage5")} class="app-message-late" />
          <For each={sent()}>
            {(text) => (
              <Message tone="you" name={t("demoYou")} time={t("demoNow")} text={text} class="app-message-new" />
            )}
          </For>
        </ol>
        <form class="app-composer" onSubmit={send}>
          <input
            ref={input}
            type="text"
            value={draft()}
            onInput={(event) => setDraft(event.currentTarget.value)}
            placeholder={t("demoPlaceholder")}
            aria-label={t("demoPlaceholder")}
            aria-describedby="demo-note"
            maxLength={16}
            autocomplete="off"
            enterkeyhint="send"
            dir="auto"
          />
          <button type="submit" aria-label={t("demoSend")} disabled={!draft().trim()}>
            <Glyph name="arrow" class="directional" />
          </button>
        </form>
      </div>
    </figure>
  );
}
