import { z } from 'zod';

export const payloadMediaSchema = z
  .object({
    id: z.string(),
    url: z.string().min(1),
    alt: z.string(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
  })
  .passthrough();

export type PayloadMedia = z.infer<typeof payloadMediaSchema>;
