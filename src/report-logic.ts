import { validatePublicUrl } from "./config.ts";

/**
 * The public "Report illegal content" form (DSA Art. 16). The checks mirror
 * the server's (`POST /safety/public-reports`); the server decides.
 */

export const KINDS = ["Message", "Server", "User", "Bot", "DiscoverServer", "CommunityItem", "Attachment"] as const;
export type Kind = (typeof KINDS)[number];

/** Reasons shown on the form and what the server receives for each */
export const CATEGORIES = {
  illegal: { category: "IllegalContent" },
  threat: { category: "HateOrThreats", subcategory: "violent_threat" },
  csam: { category: "SexualContent", subcategory: "minor_safety" },
  hate: { category: "HateOrThreats", subcategory: "hate_speech" },
  scam: { category: "ScamFraud" },
  malware: { category: "Malware" },
  harassment: { category: "Harassment" },
  privacy: { category: "PrivacyViolation" },
  copyright: { category: "IntellectualProperty" },
  flashing: { category: "Other", subcategory: "flashing" },
  other: { category: "Other" },
} as const;
export type CategoryId = keyof typeof CATEGORIES;
export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export const LIMITS = { location: 500, description: 2000, law: 200, name: 100, email: 254 } as const;

export type ReportForm = {
  kind: Kind;
  location: string;
  category: CategoryId;
  description: string;
  law: string;
  name: string;
  email: string;
  goodFaith: boolean;
};

export type FieldError =
  | "location"
  | "description"
  | "name"
  | "email"
  | "goodFaith"
  | "law";

/** Name and e-mail are optional only for child sexual abuse material */
export const isCsam = (category: CategoryId) => category === "csam";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateForm(form: ReportForm): FieldError[] {
  const errors: FieldError[] = [];
  const location = form.location.trim();
  if (!location || location.length > LIMITS.location) errors.push("location");
  const description = form.description.trim();
  if (description.length < 10 || description.length > LIMITS.description) errors.push("description");
  if (form.law.trim().length > LIMITS.law) errors.push("law");
  const name = form.name.trim();
  const email = form.email.trim();
  if (!isCsam(form.category)) {
    if (!name) errors.push("name");
    if (!email) errors.push("email");
  }
  if (name.length > LIMITS.name) errors.push("name");
  if (email && (!EMAIL.test(email) || email.length > LIMITS.email)) errors.push("email");
  if (!form.goodFaith) errors.push("goodFaith");
  return errors;
}

/** The request body. For child sexual abuse material no name or e-mail is sent unless given. */
export function buildPayload(form: ReportForm, language: string, captcha?: string) {
  const choice = CATEGORIES[form.category];
  const text = (value: string) => value.trim() || undefined;
  return {
    target_kind: form.kind,
    location: form.location.trim(),
    description: form.description.trim(),
    category: choice.category,
    subcategory: "subcategory" in choice ? choice.subcategory : undefined,
    law: text(form.law),
    name: text(form.name),
    email: text(form.email),
    good_faith: form.goodFaith,
    language,
    captcha,
  };
}

/** What a report link from Discover or Designs already knows */
export function readPrefill(search: string) {
  const query = new URLSearchParams(search);
  const kind = query.get("kind");
  return {
    kind: (KINDS as readonly string[]).includes(kind ?? "") ? (kind as Kind) : undefined,
    location: (query.get("location") ?? "").trim().slice(0, LIMITS.location),
  };
}

const LOOPBACK = ["localhost", "127.0.0.1", "[::1]"];

/** Zrzur API that receives reports: an approved HTTPS Zrzur URL, or the local stack while previewing */
export function resolveReportApi(host: string, configured: string | undefined): string | null {
  const approved = validatePublicUrl(configured);
  if (approved) return approved.replace(/\/+$/, "");
  return LOOPBACK.includes(host) ? "http://127.0.0.1:14702" : null;
}
