import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

const mediaRelationshipSchema = z.union([z.string(), payloadMediaSchema]);
const richTextSchema = z.record(z.string(), z.unknown());

export const payloadSponsorSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    logo: mediaRelationshipSchema,
    websiteUrl: z.string(),
    tier: z.enum(['platinum', 'gold', 'bronze']),
    headline: z.string().nullable().optional(),
    description: richTextSchema.nullable().optional(),
    displayOrder: z.number().nullable().optional(),
    active: z.boolean().nullable().optional(),
  })
  .passthrough();

export type PayloadSponsor = z.infer<typeof payloadSponsorSchema>;
