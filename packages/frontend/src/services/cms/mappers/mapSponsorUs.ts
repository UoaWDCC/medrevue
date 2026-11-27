import type { CmsAdapter } from '../CmsClient';
import type { SponsorUs } from '../models/SponsorUs';
import { safeHref } from '../safeHref';
import {
  type PayloadSponsorUs,
  payloadSponsorUsSchema,
} from '../schemas/sponsorUsSchema';
import { mapMedia } from './mapMedia';

export function mapSponsorUs(
  sponsorUs: PayloadSponsorUs,
  cmsBaseUrl: string,
): SponsorUs {
  return {
    title: sponsorUs.title?.trim() || undefined,
    subtitle: sponsorUs.subtitle?.trim() || undefined,
    heroImage: sponsorUs.heroImage
      ? mapMedia(sponsorUs.heroImage, cmsBaseUrl)
      : undefined,
    introduction: sponsorUs.introduction ?? undefined,
    contactButtonLabel: sponsorUs.contactButtonLabel?.trim() || undefined,
    contactButtonLink: safeHref(sponsorUs.contactButtonLink),
    impactSectionTitle: sponsorUs.impactSectionTitle?.trim() || undefined,
    impactSectionDescription: sponsorUs.impactSectionDescription ?? undefined,
    impactCards: (sponsorUs.impactCards ?? []).map((card) => ({
      id: card.id ?? undefined,
      icon: card.icon ? mapMedia(card.icon, cmsBaseUrl) : undefined,
      title: card.title,
      description: card.description,
    })),
    statisticsSectionTitle:
      sponsorUs.statisticsSectionTitle?.trim() || undefined,
    statistics: (sponsorUs.statistics ?? []).map((statistic) => ({
      id: statistic.id ?? undefined,
      value: statistic.value,
      label: statistic.label,
    })),
    previousSponsorsTitle: sponsorUs.previousSponsorsTitle?.trim() || undefined,
  };
}

export const sponsorUsAdapter: CmsAdapter<PayloadSponsorUs, SponsorUs> = {
  schema: payloadSponsorUsSchema,
  map: (sponsorUs, context) => mapSponsorUs(sponsorUs, context.cmsBaseUrl),
};
