import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

export const payloadSiteSettingsSchema = z
  .object({
    navbarLogo: z.union([z.string(), payloadMediaSchema]).nullable().optional(),
    footerCtaText: z.string().nullable().optional(),
    footerCtaLabel: z.string().nullable().optional(),
    footerCtaLink: z.string().nullable().optional(),
    copyrightText: z.string().nullable().optional(),
    facebookUrl: z.string().nullable().optional(),
    instagramUrl: z.string().nullable().optional(),
    tiktokUrl: z.string().nullable().optional(),
  })
  .passthrough();

export type PayloadSiteSettings = z.infer<typeof payloadSiteSettingsSchema>;
