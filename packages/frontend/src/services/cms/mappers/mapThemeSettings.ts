import type { CmsAdapter } from '../CmsClient';
import type { ThemeSettings } from '../models/ThemeSettings';
import {
  type PayloadThemeSettings,
  payloadThemeSettingsSchema,
} from '../schemas/themeSettingsSchema';

export function mapThemeSettings(theme: PayloadThemeSettings): ThemeSettings {
  return {
    primaryBackground: theme.primaryBackground,
    secondaryBrand: theme.secondaryBrand,
    secondaryHover: theme.secondaryHover,
    lightText: theme.lightText,
    white: theme.white,
    primaryText: theme.primaryText,
    mutedText: theme.mutedText,
    accent1: theme.accent1,
    accent2: theme.accent2,
    warmBrown: theme.warmBrown,
  };
}

export const themeSettingsAdapter: CmsAdapter<
  PayloadThemeSettings,
  ThemeSettings
> = {
  schema: payloadThemeSettingsSchema,
  map: (theme) => mapThemeSettings(theme),
};
