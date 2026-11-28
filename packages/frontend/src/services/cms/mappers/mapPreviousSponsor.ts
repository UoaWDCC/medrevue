import type { CmsAdapter } from '../CmsClient';
import type { PreviousSponsor } from '../models/PreviousSponsor';
import { safeHref } from '../safeHref';
import {
  type PayloadPreviousSponsor,
  payloadPreviousSponsorSchema,
} from '../schemas/previousSponsorSchema';
import { mapMedia } from './mapMedia';

export function mapPreviousSponsor(
  sponsor: PayloadPreviousSponsor,
  cmsBaseUrl: string,
): PreviousSponsor {
  return {
    id: sponsor.id,
    name: sponsor.name,
    logo: mapMedia(sponsor.logo, cmsBaseUrl),
    url: safeHref(sponsor.url),
  };
}

export const previousSponsorAdapter: CmsAdapter<
  PayloadPreviousSponsor,
  PreviousSponsor
> = {
  schema: payloadPreviousSponsorSchema,
  map: (sponsor, context) => mapPreviousSponsor(sponsor, context.cmsBaseUrl),
};
