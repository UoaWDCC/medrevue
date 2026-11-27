import { z } from 'zod';

export const payloadTeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  category: z.string(),
  image: z.object({
    url: z.string(),
  }),
  displayOrder: z.number(),
});

export type PayloadTeamMember = z.infer<typeof payloadTeamMemberSchema>;

export const payloadTeamSchema = z.object({
  docs: z.array(payloadTeamMemberSchema),
  totalDocs: z.number(),
  limit: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type PayloadTeam = z.infer<typeof payloadTeamSchema>;
