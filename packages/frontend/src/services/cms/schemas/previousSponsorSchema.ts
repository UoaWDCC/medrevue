import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

export const payloadPreviousSponsorSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    logo: z.union([z.string(), payloadMediaSchema]),
    url: z.string(),
  })
  .passthrough();

export type PayloadPreviousSponsor = z.infer<
  typeof payloadPreviousSponsorSchema
>;
