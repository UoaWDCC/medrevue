import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

const validateHexColour = (value: null | string | undefined) => {
  if (!value) return 'A colour value is required.';

  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value)
    ? true
    : 'Enter a 3- or 6-digit hex colour, for example #000 or #F2D558.';
};

const colourField = (name: string, label: string, defaultValue: string) => ({
  name,
  label,
  type: 'text' as const,
  required: true,
  defaultValue,
  validate: validateHexColour,
});

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme Settings',
  access: { read: () => true, update: authenticated },
  fields: [
    colourField('primaryBackground', 'Primary background', '#000000'),
    colourField('secondaryBrand', 'Secondary / brand colour', '#F2D558'),
    colourField('secondaryHover', 'Secondary hover colour', '#D8BA35'),
    colourField('lightText', 'Light-on-dark text', '#FDF7E4'),
    colourField('white', 'White', '#FFFFFF'),
    colourField('primaryText', 'Primary text', '#313131'),
    colourField('mutedText', 'Muted text', '#828282'),
    colourField('accent1', 'Accent colour 1', '#FE7EE5'),
    colourField('accent2', 'Accent colour 2', '#4CBF46'),
    colourField('warmBrown', 'Warm brown', '#AB751C'),
  ],
};
