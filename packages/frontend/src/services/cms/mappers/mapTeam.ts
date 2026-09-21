import type { CmsAdapter } from '../CmsClient';
import type { Team, TeamMember } from '../models/Team';
import { type PayloadTeam, payloadTeamSchema } from '../schemas/teamSchema';

export function mapTeam(team: PayloadTeam): Team {
  return team.docs
    .map(
      (member): TeamMember => ({
        name: member.name,
        role: member.role,
        category: member.category,
        image: member.image.url,
        displayOrder: member.displayOrder,
      }),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export const teamAdapter: CmsAdapter<PayloadTeam, Team> = {
  schema: payloadTeamSchema,
  map: (team) => mapTeam(team),
};
