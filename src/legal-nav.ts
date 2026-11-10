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
