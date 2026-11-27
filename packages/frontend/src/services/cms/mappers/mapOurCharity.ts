import type { CmsAdapter } from '../CmsClient';
import type { OurCharity } from '../models/OurCharity';
import { safeHref } from '../safeHref';
import {
  type PayloadOurCharity,
  payloadOurCharitySchema,
} from '../schemas/ourCharitySchema';
import { mapMedia } from './mapMedia';

export function mapOurCharity(
  charity: PayloadOurCharity,
  cmsBaseUrl: string,
): OurCharity {
  return {
    heading: charity.heading?.trim() || undefined,
    body: charity.body ?? undefined,
    image: charity.image ? mapMedia(charity.image, cmsBaseUrl) : undefined,
    donationLink: safeHref(charity.donationLink),
    donationLinkLabel: charity.donationLinkLabel?.trim() || 'Donate',
  };
}

export const ourCharityAdapter: CmsAdapter<PayloadOurCharity, OurCharity> = {
  schema: payloadOurCharitySchema,
  map: (charity, context) => mapOurCharity(charity, context.cmsBaseUrl),
};
