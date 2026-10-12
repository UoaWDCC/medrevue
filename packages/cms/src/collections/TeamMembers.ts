import type { Access, CollectionConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category', 'displayOrder'],
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
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'Actors',
        'Dancers',
        'Barbershop',
        'Band',
        'Backstage',
        'Production',
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
