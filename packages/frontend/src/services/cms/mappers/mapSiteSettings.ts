import type { CmsAdapter } from '../CmsClient';
import type { SiteSettings } from '../models/SiteSettings';
import {
  type PayloadSiteSettings,
  payloadSiteSettingsSchema,
} from '../schemas/siteSettingsSchema';
import { mapMedia } from './mapMedia';

export function mapSiteSettings(
  settings: PayloadSiteSettings,
  cmsBaseUrl: string,
): SiteSettings {
  return {
    navbarLogo: settings.navbarLogo
      ? mapMedia(settings.navbarLogo, cmsBaseUrl)
      : undefined,
    footerCtaText: settings.footerCtaText?.trim() || undefined,
    footerCtaLabel: settings.footerCtaLabel?.trim() || undefined,
    footerCtaLink: settings.footerCtaLink?.trim() || undefined,
    copyrightText: settings.copyrightText?.trim() || undefined,
    facebookUrl: settings.facebookUrl?.trim() || undefined,
    instagramUrl: settings.instagramUrl?.trim() || undefined,
    tiktokUrl: settings.tiktokUrl?.trim() || undefined,
  };
}

export const siteSettingsAdapter: CmsAdapter<
  PayloadSiteSettings,
  SiteSettings
> = {
  schema: payloadSiteSettingsSchema,
  map: (settings, context) => mapSiteSettings(settings, context.cmsBaseUrl),
};
