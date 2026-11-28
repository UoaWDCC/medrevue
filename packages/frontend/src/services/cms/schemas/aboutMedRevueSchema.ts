import { z } from 'zod';
import { payloadMediaSchema } from './mediaSchema';

export const payloadAboutMedRevueSchema = z
  .object({
    heading: z.string(),
    body: z.record(z.string(), z.unknown()),
    image: z.union([z.string(), payloadMediaSchema]),
  })
  .passthrough();

export type PayloadAboutMedRevue = z.infer<typeof payloadAboutMedRevueSchema>;
