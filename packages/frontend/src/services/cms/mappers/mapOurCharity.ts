import type { CmsAdapter } from '../CmsClient';
import type { OurCharity } from '../models/OurCharity';
import {
  type PayloadOurCharity,
  payloadOurCharitySchema,
} from '../schemas/ourCharitySchema';

export function mapOurCharity(charity: PayloadOurCharity): OurCharity {
  return {
    donationLink: charity.donationLink?.trim() || undefined,
    donationLinkLabel: charity.donationLinkLabel?.trim() || 'Donate',
  };
}

export const ourCharityAdapter: CmsAdapter<PayloadOurCharity, OurCharity> = {
  schema: payloadOurCharitySchema,
  map: (charity) => mapOurCharity(charity),
};
