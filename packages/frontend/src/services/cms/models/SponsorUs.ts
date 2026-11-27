import type { MediaAsset } from './Media';

export type ImpactCard = {
  id?: string;
  icon?: MediaAsset;
  title: string;
  description: Record<string, unknown>;
};

export type Statistic = {
  id?: string;
  value: string;
  label: string;
};

export type SponsorUs = {
  title?: string;
  subtitle?: string;
  heroImage?: MediaAsset;
  introduction?: Record<string, unknown>;
  contactButtonLabel?: string;
  contactButtonLink?: string;
  impactSectionTitle?: string;
  impactSectionDescription?: Record<string, unknown>;
  impactCards: ImpactCard[];
  statisticsSectionTitle?: string;
  statistics: Statistic[];
  previousSponsorsTitle?: string;
};
