import { z } from 'zod';

const richTextSchema = z.record(z.string(), z.unknown());

export const payloadContactSchema = z
  .object({
    pageTitle: z.string(),
    subtitle: z.string().nullable().optional(),
    introduction: richTextSchema.nullable().optional(),
    contactInformationHeading: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
  })
  .passthrough();

export type PayloadContact = z.infer<typeof payloadContactSchema>;
