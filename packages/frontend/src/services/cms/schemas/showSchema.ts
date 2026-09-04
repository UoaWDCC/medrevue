import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

const mediaRelationshipSchema = z.union([z.string(), payloadMediaSchema]);
const richTextSchema = z.record(z.string(), z.unknown());

const performanceSchema = z
  .object({
    startsAt: z.string(),
    endsAt: z.string().nullable().optional(),
    doorsOpenAt: z.string().nullable().optional(),
    id: z.string().nullable().optional(),
  })
  .passthrough();

export const payloadShowSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    year: z.number(),
    poster: mediaRelationshipSchema,
    isCurrentShow: z.boolean().nullable().optional(),
    shortDescription: richTextSchema.nullable().optional(),
    performances: z.array(performanceSchema).nullable().optional(),
    venue: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    ticketsOnSale: z.boolean().nullable().optional(),
    ticketLink: z.string().nullable().optional(),
    ticketButtonLabel: z.string().nullable().optional(),
    galleryImages: z
      .array(
        z
          .object({
            image: mediaRelationshipSchema,
            id: z.string().nullable().optional(),
          })
          .passthrough(),
      )
      .nullable()
      .optional(),
    displayOrder: z.number().nullable().optional(),
  })
  .passthrough();

export type PayloadShow = z.infer<typeof payloadShowSchema>;
