import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const CurrentShow: GlobalConfig = {
  slug: 'current-show',
  label: 'Current Show',
  access: { read: () => true, update: authenticated },
  fields: [
    {
      name: 'show',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: false,
      admin: { sortOptions: '-year' },
    },
  ],
};
