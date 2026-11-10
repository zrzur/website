import type { Language } from "./i18n";
import type { Label } from "./strings";
import type { LegalGroup, LegalSlug } from "./policies/shared.ts";

/** What every page needs about the policies, without their long texts */
export const legalSlugs: LegalSlug[] = [
  "terms",
  "privacy",
  "community-guidelines",
  "enforcement-appeals",
  "paid-services",
  "server-owner-rules",
  "discover-guidelines",
  "developer-terms",
  "plugin-policy",
  "creator-terms",
  "imprint",
  "contact",
];

/** The shelves of the legal hub; their names are site words (src/locales) */
export const legalGroups: { id: LegalGroup; title: Label }[] = [
  { id: "everyone", title: "legalGroupEveryone" },
  { id: "servers", title: "legalGroupServers" },
  { id: "builders", title: "legalGroupBuilders" },
  { id: "operator", title: "legalGroupOperator" },
];

/** Short footer links. */
export const legalFooterLinks: { slug: LegalSlug; label: Label }[] = [
  { slug: "terms", label: "legalLinkTerms" },
  { slug: "privacy", label: "legalLinkPrivacy" },
  { slug: "community-guidelines", label: "legalLinkCommunity" },
  { slug: "developer-terms", label: "legalLinkDeveloper" },
  { slug: "imprint", label: "legalLinkImprint" },
  { slug: "contact", label: "legalLinkContact" },
  { slug: "paid-services", label: "legalLinkPaid" },
];

/**
 * The languages each policy has a full text in (test/legal.test.mjs checks
 * this against the texts). Under any other language prefix the page shows
 * the English text: it is not a page of its own for search engines.
 */
const WITH_GERMAN: Language[] = ["en", "ar", "de"];
const WITHOUT_GERMAN: Language[] = ["en", "ar"];
export const legalLanguages: Record<LegalSlug, Language[]> = {
  terms: WITHOUT_GERMAN,
  privacy: WITH_GERMAN,
  "community-guidelines": WITHOUT_GERMAN,
  "enforcement-appeals": WITH_GERMAN,
  "paid-services": WITHOUT_GERMAN,
  "server-owner-rules": WITHOUT_GERMAN,
  "discover-guidelines": WITHOUT_GERMAN,
  "developer-terms": WITHOUT_GERMAN,
  "plugin-policy": WITHOUT_GERMAN,
  "creator-terms": WITH_GERMAN,
  imprint: WITH_GERMAN,
  contact: WITH_GERMAN,
};
