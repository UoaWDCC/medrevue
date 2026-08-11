import type { Access, CollectionConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'active', 'displayOrder'],
  },
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc, req, context }) => {
        if (
          context.convertingToPreviousSponsor ||
          !doc.convertToPreviousSponsor ||
          doc.previousSponsor
        ) {
          return doc;
        }

        const previousSponsor = await req.payload.create({
          collection: 'previous-sponsors',
          data: {
            name: doc.name,
            logo: doc.logo,
            url: doc.websiteUrl,
          },
          req,
        });

        await req.payload.update({
          collection: 'sponsors',
          id: doc.id,
          data: {
            active: false,
            convertToPreviousSponsor: false,
            previousSponsor: previousSponsor.id,
          },
          req,
          context: { convertingToPreviousSponsor: true },
        });

        return doc;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'websiteUrl', type: 'text', required: true },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: ['platinum', 'gold', 'bronze'],
    },
    { name: 'headline', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'convertToPreviousSponsor',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'On save, creates a matching Previous Sponsor entry and removes this sponsor from the active list.',
        condition: (_, siblingData) => !siblingData.previousSponsor,
      },
    },
    {
      name: 'previousSponsor',
      type: 'relationship',
      relationTo: 'previous-sponsors',
      admin: {
        readOnly: true,
        description: 'The Previous Sponsor entry created from this sponsor.',
      },
    },
  ],
};
