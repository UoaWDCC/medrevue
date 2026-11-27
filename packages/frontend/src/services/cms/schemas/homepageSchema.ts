import { z } from 'zod';

export const payloadHomepageSchema = z
  .object({
    heroOrganisationTitle: z.string(),
    heroTagline: z.string().nullable().optional(),
  })
  .passthrough();

export type PayloadHomepage = z.infer<typeof payloadHomepageSchema>;
