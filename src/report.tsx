import { For, Show, createSignal, onMount } from "solid-js";

import { reportText } from "./report-text.ts";
import {
  CATEGORIES,
  CATEGORY_IDS,
  KINDS,
  LIMITS,
  buildPayload,
  isCsam,
  readPrefill,
  resolveReportApi,
  validateForm,
  type CategoryId,
  type FieldError,
  type Kind,
} from "./report-logic.ts";
import { localizedPath, type Language } from "./i18n.ts";

type Receipt = { reference: string };

declare global {
  interface Window {
    hcaptcha?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

/** Public form to report illegal content without an account (DSA Art. 16) */
export default function ReportPage(props: { language: Language }) {
  const text = () => reportText[props.language];
  const api = resolveReportApi(location.hostname, import.meta.env.VITE_PUBLIC_API_URL);

  const prefill = readPrefill(location.search);
  const [kind, setKind] = createSignal<Kind>(prefill.kind ?? "Message");
  const [location_, setLocation] = createSignal(prefill.location);
  const [category, setCategory] = createSignal<CategoryId>("illegal");
  const [description, setDescription] = createSignal("");
  const [law, setLaw] = createSignal("");
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [goodFaith, setGoodFaith] = createSignal(false);
  const [errors, setErrors] = createSignal<FieldError[]>([]);
  const [busy, setBusy] = createSignal(false);
  const [failure, setFailure] = createSignal<{ message: string; details?: string } | null>(null);
  const [receipt, setReceipt] = createSignal<Receipt | null>(null);
  const [sentEmail, setSentEmail] = createSignal(false);

  // hCaptcha only when the API says sign-up uses it
  let captchaBox!: HTMLDivElement;
  let captchaId: string | undefined;
  let siteKey: string | undefined;
  const [captchaToken, setCaptchaToken] = createSignal<string>();
  const [captchaOn, setCaptchaOn] = createSignal(false);
  // the widget lives inside the form, which the receipt replaces, and a token
  // works once: every new form needs its own widget and token
  function renderCaptcha() {
    setCaptchaToken(undefined);
    if (!siteKey) return;
    captchaId = window.hcaptcha?.render(captchaBox, {
      sitekey: siteKey,
      callback: (token: string) => setCaptchaToken(token),
      "expired-callback": () => setCaptchaToken(undefined),
    });
  }
  onMount(async () => {
    if (!api) return;
    try {
      const root = await (await fetch(`${api}/`)).json();
      const captcha = root?.features?.captcha;
      if (!captcha?.key) return;
      siteKey = captcha.key;
      setCaptchaOn(true);
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.append(script);
      });
      renderCaptcha();
    } catch {
      /* the form still works; the server asks for a token if it needs one */
    }
  });

  const has = (field: FieldError) => errors().includes(field);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setFailure(null);
    const form = {
      kind: kind(),
      location: location_(),
      category: category(),
      description: description(),
      law: law(),
      name: name(),
      email: email(),
      goodFaith: goodFaith(),
    };
    const found = validateForm(form);
    setErrors(found);
    if (found.length) {
      document.getElementById(`report-${found[0]}`)?.focus();
      return;
    }
    if (!api) {
      setFailure({ message: text().unavailable });
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${api}/safety/public-reports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildPayload(form, props.language, captchaToken())),
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok) {
        setSentEmail(Boolean(form.email.trim()));
        setReceipt({ reference: body.reference });
        return;
      }
      const type: string = body?.type ?? "";
      const message =
        response.status === 429 || type === "TooManyReports"
          ? text().tooMany
          : type === "CaptchaFailed"
            ? text().captchaFailed
            : text().failed;
      setFailure({ message, details: `${response.status} ${type} ${body?.error ?? ""}`.trim() });
      if (captchaId !== undefined) {
        window.hcaptcha?.reset(captchaId);
        setCaptchaToken(undefined);
      }
    } catch (error) {
      setFailure({ message: text().failed, details: String(error) });
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setReceipt(null);
    setDescription("");
    setLocation("");
    setLaw("");
    setGoodFaith(false);
    setErrors([]);
    renderCaptcha();
  }

  const Error = (p: { field: FieldError }) => (
    <Show when={has(p.field)}>
      <p class="report-error" id={`report-${p.field}-error`} role="alert">
        {text().errors[p.field]}
      </p>
    </Show>
  );

  return (
    <>
      <header class="page-heading page-heading-quiet container">
        <div>
          <h1>{text().title}</h1>
          <p>{text().intro}</p>
        </div>
      </header>
      <section class="container report-section">
        <Show
          when={!receipt()}
          fallback={
            <div class="report-done" role="status" data-testid="report-done">
              <h2>{text().doneTitle}</h2>
              <p>{text().doneBody}</p>
              <p>
                {text().referenceLabel}: <strong dir="ltr">{receipt()!.reference}</strong>
              </p>
              <Show when={sentEmail()}>
                <p>{text().receiptMail}</p>
              </Show>
              <button type="button" class="button button-outline" onClick={reset}>
                {text().another}
              </button>
            </div>
          }
        >
          <form class="report-form" onSubmit={submit} noValidate data-testid="report-form">
            <fieldset class="report-choices">
              <legend>{text().kindLegend}</legend>
              <For each={KINDS}>
                {(item) => (
                  <label class="report-choice">
                    <input
                      type="radio"
                      name="kind"
                      value={item}
                      checked={kind() === item}
                      onChange={() => setKind(item)}
                    />
                    <span>{text().kinds[item]}</span>
                  </label>
                )}
              </For>
            </fieldset>

            <div class="report-field">
              <label for="report-location">{text().locationLabel}</label>
              <input
                id="report-location"
                type="text"
                maxLength={LIMITS.location}
                value={location_()}
                onInput={(e) => setLocation(e.currentTarget.value)}
                aria-invalid={has("location")}
                aria-describedby="report-location-hint report-location-error"
                dir="auto"
              />
              <p class="report-hint" id="report-location-hint">{text().locationHint}</p>
              <Error field="location" />
            </div>

            <fieldset class="report-choices">
              <legend>{text().categoryLegend}</legend>
              <For each={CATEGORY_IDS}>
                {(item) => (
                  <label class="report-choice">
                    <input
                      type="radio"
                      name="category"
                      value={item}
                      checked={category() === item}
                      onChange={() => setCategory(item)}
                    />
                    <span>{text().categories[item]}</span>
                  </label>
                )}
              </For>
              <Show when={isCsam(category())}>
                <p class="report-hint">{text().csamNote}</p>
              </Show>
            </fieldset>

            <div class="report-field">
              <label for="report-description">{text().descriptionLabel}</label>
              <textarea
                id="report-description"
                rows="6"
                maxLength={LIMITS.description}
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                aria-invalid={has("description")}
                aria-describedby="report-description-hint report-description-error"
                dir="auto"
              />
              <p class="report-hint" id="report-description-hint">{text().descriptionHint}</p>
              <Error field="description" />
            </div>

            <div class="report-field">
              <label for="report-law">{text().lawLabel}</label>
              <input
                id="report-law"
                type="text"
                maxLength={LIMITS.law}
                value={law()}
                onInput={(e) => setLaw(e.currentTarget.value)}
                aria-describedby="report-law-hint report-law-error"
                dir="auto"
              />
              <p class="report-hint" id="report-law-hint">{text().lawHint}</p>
              <Error field="law" />
            </div>

            <div class="report-field">
              <label for="report-name">
                {text().nameLabel}
                <Show when={isCsam(category())}> ({text().optionalForCsam})</Show>
              </label>
              <input
                id="report-name"
                type="text"
                autocomplete="name"
                maxLength={LIMITS.name}
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                aria-invalid={has("name")}
                aria-describedby="report-name-error"
                dir="auto"
              />
              <Error field="name" />
            </div>
            <div class="report-field">
              <label for="report-email">
                {text().emailLabel}
                <Show when={isCsam(category())}> ({text().optionalForCsam})</Show>
              </label>
              <input
                id="report-email"
                type="email"
                autocomplete="email"
                maxLength={LIMITS.email}
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                aria-invalid={has("email")}
                aria-describedby="report-email-hint report-email-error"
                dir="ltr"
              />
              <p class="report-hint" id="report-email-hint">{text().contactHint}</p>
              <Error field="email" />
            </div>

            <div class="report-field">
              <label class="report-check">
                <input
                  id="report-goodFaith"
                  type="checkbox"
                  checked={goodFaith()}
                  onChange={(e) => setGoodFaith(e.currentTarget.checked)}
                  aria-invalid={has("goodFaith")}
                  aria-describedby="report-goodFaith-error"
                />
                <span>{text().goodFaith}</span>
              </label>
              <Error field="goodFaith" />
            </div>

            <div ref={captchaBox} class="report-captcha" />

            <Show when={failure()}>
              <div class="report-failure" role="alert" data-testid="report-failure">
                <p>{failure()!.message}</p>
                <Show when={failure()!.details}>
                  <details>
                    <summary>{text().details}</summary>
                    <code dir="ltr">{failure()!.details}</code>
                  </details>
                </Show>
              </div>
            </Show>

            <button type="submit" class="button button-primary" disabled={busy()}>
              {busy() ? text().sending : text().submit}
            </button>
            <p class="report-hint" data-testid="report-privacy">
              {text().privacy}{" "}
              <a href={localizedPath("/legal/privacy", props.language)}>{text().privacyLink}</a>
            </p>
            <Show when={captchaOn()}>
              <p class="report-hint">{text().captchaNote}</p>
            </Show>
            <p class="report-hint">{text().inApp}</p>
          </form>
        </Show>
      </section>
    </>
  );
}

export { CATEGORIES };
