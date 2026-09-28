import { describe, expect, test } from 'vitest';
import { mapThemeSettings } from '../mappers/mapThemeSettings';
import type { PayloadThemeSettings } from '../schemas/themeSettingsSchema';

describe('mapThemeSettings', () => {
  test('passes Payload theme colours through to the frontend model', () => {
    const payloadTheme: PayloadThemeSettings = {
      primaryBackground: '#000000',
      secondaryBrand: '#F2D558',
      secondaryHover: '#D8BA35',
      lightText: '#FDF7E4',
      white: '#FFFFFF',
      primaryText: '#313131',
      mutedText: '#828282',
      accent1: '#FE7EE5',
      accent2: '#4CBF46',
      warmBrown: '#AB751C',
    };

    expect(mapThemeSettings(payloadTheme)).toEqual(payloadTheme);
  });
});
