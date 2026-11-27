import type { MediaAsset } from './Media';

export type SponsorTier = 'platinum' | 'gold' | 'bronze';

export type Sponsor = {
  id: string;
  name: string;
  logo: MediaAsset;
  websiteUrl: string;
  tier: SponsorTier;
  headline?: string;
  description?: Record<string, unknown>;
  displayOrder: number;
  active: boolean;
};
