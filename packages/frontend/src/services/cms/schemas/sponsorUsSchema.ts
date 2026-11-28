import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

const mediaRelationshipSchema = z.union([z.string(), payloadMediaSchema]);
const richTextSchema = z.record(z.string(), z.unknown());

const impactCardSchema = z
  .object({
    id: z.string().nullable().optional(),
    icon: mediaRelationshipSchema.nullable().optional(),
    title: z.string(),
    description: richTextSchema,
  })
  .passthrough();

const statisticSchema = z
  .object({
    id: z.string().nullable().optional(),
    value: z.string(),
    label: z.string(),
  })
  .passthrough();

export const payloadSponsorUsSchema = z
  .object({
    title: z.string().nullable().optional(),
    subtitle: z.string().nullable().optional(),
    heroImage: mediaRelationshipSchema.nullable().optional(),
    introduction: richTextSchema.nullable().optional(),
    contactButtonLabel: z.string().nullable().optional(),
    contactButtonLink: z.string().nullable().optional(),
    impactSectionTitle: z.string().nullable().optional(),
    impactSectionDescription: richTextSchema.nullable().optional(),
    impactCards: z.array(impactCardSchema).nullable().optional(),
    statisticsSectionTitle: z.string().nullable().optional(),
    statistics: z.array(statisticSchema).nullable().optional(),
    previousSponsorsTitle: z.string().nullable().optional(),
  })
  .passthrough();

export type PayloadSponsorUs = z.infer<typeof payloadSponsorUsSchema>;
