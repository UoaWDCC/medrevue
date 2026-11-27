import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: authenticated },
  fields: [
    {
      name: 'navbarLogo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description:
          'Navbar logo. Leave empty to use the default MedRevue logo.',
      },
    },
    { name: 'footerCtaText', type: 'text' },
    { name: 'footerCtaLabel', type: 'text', defaultValue: 'Contact Us' },
    { name: 'footerCtaLink', type: 'text', defaultValue: '/contact' },
    { name: 'copyrightText', type: 'text' },
    { name: 'facebookUrl', type: 'text' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'tiktokUrl', type: 'text' },
  ],
};
