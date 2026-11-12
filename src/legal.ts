import {
  type LegalDocument,
  type LegalGroup,
  type LegalSlug,
} from "./policies/shared.ts";
import { terms } from "./policies/terms.ts";
import { privacy } from "./policies/privacy.ts";
import { communityGuidelines } from "./policies/community-guidelines.ts";
import { enforcementAppeals } from "./policies/enforcement-appeals.ts";
import { paidServices } from "./policies/paid-services.ts";
import { serverOwnerRules } from "./policies/server-owner-rules.ts";
import { discoverGuidelines } from "./policies/discover-guidelines.ts";
import { developerTerms } from "./policies/developer-terms.ts";
import { pluginPolicy } from "./policies/plugin-policy.ts";
import { creatorTerms } from "./policies/creator-terms.ts";
import { imprint } from "./policies/imprint.ts";
import { contact } from "./policies/contact.ts";

export type { LegalDocument, LegalGroup, LegalSlug };
export { legalFooterLinks, legalGroups, legalSlugs } from "./legal-nav.ts";

export const legalDocuments: LegalDocument[] = [
  terms,
  privacy,
  communityGuidelines,
  enforcementAppeals,
  paidServices,
  serverOwnerRules,
  discoverGuidelines,
  developerTerms,
  pluginPolicy,
  creatorTerms,
  imprint,
  contact,
];

/**
 * Current version of each policy. The app compares the version a user
 * accepted with this map and asks again when a version changes.
 */
export const policyVersions: Record<LegalSlug, string> = Object.fromEntries(
  legalDocuments.map((document) => [document.slug, document.version]),
) as Record<LegalSlug, string>;

