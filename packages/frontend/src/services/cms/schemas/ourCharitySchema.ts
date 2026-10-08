import { z } from 'zod';

export const payloadOurCharitySchema = z
  .object({
    donationLink: z.string().nullable().optional(),
    donationLinkLabel: z.string().nullable().optional(),
  })
  .passthrough();

export type PayloadOurCharity = z.infer<typeof payloadOurCharitySchema>;
