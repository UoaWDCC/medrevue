import { z } from 'zod';
import { payloadShowSchema } from './showSchema';

export const payloadCurrentShowSchema = z
  .object({
    show: z.union([z.string(), payloadShowSchema]).nullable().optional(),
  })
  .passthrough();

export type PayloadCurrentShow = z.infer<typeof payloadCurrentShowSchema>;
