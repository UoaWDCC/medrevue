import { z } from 'zod';

const payloadMediaSchema = z
  .object({
    url: z.string(),
  })
  .passthrough();

export const payloadTeamMemberSchema = z
  .object({
    name: z.string(),
    role: z.string(),
    category: z.string(),
    image: payloadMediaSchema,
    displayOrder: z.number(),
  })
  .passthrough();

export const payloadTeamSchema = z
  .object({
    docs: z.array(payloadTeamMemberSchema),
  })
  .passthrough();

export type PayloadTeam = z.infer<typeof payloadTeamSchema>;
