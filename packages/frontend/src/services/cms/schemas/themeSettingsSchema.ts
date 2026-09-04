import { z } from 'zod';

export const payloadThemeSettingsSchema = z
  .object({
    primaryBackground: z.string(),
    secondaryBrand: z.string(),
    secondaryHover: z.string(),
    lightText: z.string(),
    white: z.string(),
    primaryText: z.string(),
    mutedText: z.string(),
    accent1: z.string(),
    accent2: z.string(),
    warmBrown: z.string(),
  })
  .passthrough();

export type PayloadThemeSettings = z.infer<typeof payloadThemeSettingsSchema>;
