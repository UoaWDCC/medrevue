import { z } from 'zod';

// Payload sets a size's url to null when it couldn't generate that size.
const imageSizeSchema = z
  .object({ url: z.string().min(1).nullable().optional() })
  .passthrough();

export const payloadImageSizesSchema = z
  .object({
    thumbnail: imageSizeSchema.optional(),
    large: imageSizeSchema.optional(),
  })
  .passthrough();

export const payloadMediaSchema = z
  .object({
    id: z.string(),
    url: z.string().min(1),
    alt: z.string(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
    sizes: payloadImageSizesSchema.optional(),
  })
  .passthrough();

export type PayloadMedia = z.infer<typeof payloadMediaSchema>;
