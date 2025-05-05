import { TeamMemberEntity } from './team_member.emtity';
import { TournamentTeamEntity } from './tournament_team.entity';

export class TeamEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly members: TeamMemberEntity[],  
    public readonly entries: TournamentTeamEntity[], 
    public readonly createdAt: Date,
  ) {}
}
