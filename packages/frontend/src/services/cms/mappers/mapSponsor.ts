import type { CmsAdapter } from '../CmsClient';
import type { Sponsor } from '../models/Sponsor';
import {
  type PayloadSponsor,
  payloadSponsorSchema,
} from '../schemas/sponsorSchema';
import { mapMedia } from './mapMedia';

export function mapSponsor(
  sponsor: PayloadSponsor,
  cmsBaseUrl: string,
): Sponsor {
  return {
    id: sponsor.id,
    name: sponsor.name,
    logo: mapMedia(sponsor.logo, cmsBaseUrl),
    websiteUrl: sponsor.websiteUrl,
    tier: sponsor.tier,
    headline: sponsor.headline ?? undefined,
    description: sponsor.description ?? undefined,
    displayOrder: sponsor.displayOrder ?? 0,
    active: sponsor.active ?? true,
  };
}

export const sponsorAdapter: CmsAdapter<PayloadSponsor, Sponsor> = {
  schema: payloadSponsorSchema,
  map: (sponsor, context) => mapSponsor(sponsor, context.cmsBaseUrl),
};
