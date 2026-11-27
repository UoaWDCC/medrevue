import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

export const payloadOurCharitySchema = z
  .object({
    heading: z.string().nullable().optional(),
    body: z.record(z.string(), z.unknown()).nullable().optional(),
    image: z.union([z.string(), payloadMediaSchema]).nullable().optional(),
    donationLink: z.string().nullable().optional(),
    donationLinkLabel: z.string().nullable().optional(),
  })
  .passthrough();

export type PayloadOurCharity = z.infer<typeof payloadOurCharitySchema>;
