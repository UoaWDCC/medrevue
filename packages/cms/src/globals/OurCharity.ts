import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const OurCharity: GlobalConfig = {
  slug: 'our-charity',
  access: { read: () => true, update: authenticated },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Our Charity',
    },
    { name: 'body', type: 'richText', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'donationLink', type: 'text' },
    { name: 'donationLinkLabel', type: 'text', defaultValue: 'Donate' },
  ],
};
