import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: { read: () => true, update: authenticated },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Contact Us',
    },
    { name: 'subtitle', type: 'text' },
    { name: 'introduction', type: 'richText' },
    {
      name: 'contactInformationHeading',
      type: 'text',
      defaultValue: 'Contact Information',
    },
    { name: 'email', type: 'email' },
    { name: 'location', type: 'text' },
  ],
};
