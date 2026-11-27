import type { CmsAdapter } from '../CmsClient';
import type { Homepage } from '../models/Homepage';
import {
  type PayloadHomepage,
  payloadHomepageSchema,
} from '../schemas/homepageSchema';

export function mapHomepage(homepage: PayloadHomepage): Homepage {
  return {
    heroOrganisationTitle: homepage.heroOrganisationTitle.trim(),
    heroTagline: homepage.heroTagline?.trim() || undefined,
  };
}

export const homepageAdapter: CmsAdapter<PayloadHomepage, Homepage> = {
  schema: payloadHomepageSchema,
  map: (homepage) => mapHomepage(homepage),
};
