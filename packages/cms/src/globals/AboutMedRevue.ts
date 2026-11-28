import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const AboutMedRevue: GlobalConfig = {
  slug: 'about-med-revue',
  access: { read: () => true, update: authenticated },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'About Med Revue',
    },
    { name: 'body', type: 'richText', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
};
