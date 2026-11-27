import type { MediaAsset } from './Media';

export type OurCharity = {
  heading?: string;
  body?: Record<string, unknown>;
  image?: MediaAsset;
  donationLink?: string;
  donationLinkLabel: string;
};
