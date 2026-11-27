import type { Access, CollectionConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const PreviousSponsors: CollectionConfig = {
  slug: 'previous-sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url', 'updatedAt'],
  },
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (value: null | string | undefined) => {
        if (!value) return 'URL is required.';

        try {
          const url = new URL(value);
          return ['http:', 'https:'].includes(url.protocol)
            ? true
            : 'URL must use http or https.';
        } catch {
          return 'Enter a valid URL.';
        }
      },
    },
  ],
};
