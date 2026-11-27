import type { CmsAdapter } from '../CmsClient';
import type { SiteSettings } from '../models/SiteSettings';
import { safeHref } from '../safeHref';
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
    footerCtaLink: safeHref(settings.footerCtaLink),
    copyrightText: settings.copyrightText?.trim() || undefined,
    facebookUrl: safeHref(settings.facebookUrl),
    instagramUrl: safeHref(settings.instagramUrl),
    tiktokUrl: safeHref(settings.tiktokUrl),
  };
}

export const siteSettingsAdapter: CmsAdapter<
  PayloadSiteSettings,
  SiteSettings
> = {
  schema: payloadSiteSettingsSchema,
  map: (settings, context) => mapSiteSettings(settings, context.cmsBaseUrl),
};
