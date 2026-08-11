import type { Access, GlobalConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: { read: () => true, update: authenticated },
  fields: [
    { name: 'heroOrganisationTitle', type: 'text', required: true },
    { name: 'heroTagline', type: 'text' },
  ],
};
