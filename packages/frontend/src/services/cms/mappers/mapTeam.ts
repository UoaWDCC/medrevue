import type { CmsAdapter } from '../CmsClient';

import type { TeamMember } from '../models/Team';

import {
  type PayloadTeamMember,
  payloadTeamMemberSchema,
} from '../schemas/teamSchema';

export const teamAdapter: CmsAdapter<PayloadTeamMember, TeamMember> = {
  schema: payloadTeamMemberSchema,

  map: (member, context) => ({
    name: member.name,
    role: member.role,
    category: member.category,
    image: new URL(member.image.url, context.cmsBaseUrl).toString(),
    displayOrder: member.displayOrder,
  }),
};
