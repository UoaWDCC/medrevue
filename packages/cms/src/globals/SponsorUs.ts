import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const SponsorUs: GlobalConfig = {
  slug: 'sponsor-us',
  access: { read: () => true, update: authenticated },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Sponsor Us' },
    { name: 'subtitle', type: 'text' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'introduction', type: 'richText' },
    { name: 'contactButtonLabel', type: 'text', defaultValue: 'Contact Us' },
    { name: 'contactButtonLink', type: 'text', defaultValue: '/contact' },
    { name: 'impactSectionTitle', type: 'text' },
    { name: 'impactSectionDescription', type: 'richText' },
    {
      name: 'impactCards',
      type: 'array',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'richText', required: true },
      ],
    },
    {
      name: 'statisticsSectionTitle',
      type: 'text',
      defaultValue: 'Our Impact',
    },
    {
      name: 'statistics',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'previousSponsorsTitle',
      type: 'text',
      defaultValue: 'Previous Sponsors',
    },
  ],
};
