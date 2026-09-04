import type { Access, CollectionConfig } from 'payload';

const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const Shows: CollectionConfig = {
  slug: 'shows',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'isCurrentShow', 'updatedAt'],
  },
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'year', type: 'number', required: true, min: 2000 },
    { name: 'poster', type: 'upload', relationTo: 'media', required: true },
    { name: 'isCurrentShow', type: 'checkbox', defaultValue: false },
    { name: 'shortDescription', type: 'richText' },
    {
      name: 'performances',
      type: 'array',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'doorsOpenAt',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    { name: 'venue', type: 'text' },
    { name: 'address', type: 'text' },
    {
      name: 'ticketsOnSale',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'ticketLink',
      type: 'text',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData.ticketsOnSale),
      },
    },
    {
      name: 'ticketButtonLabel',
      type: 'text',
      defaultValue: 'Order Tickets',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData.ticketsOnSale),
      },
    },
    {
      name: 'galleryImages',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
};
