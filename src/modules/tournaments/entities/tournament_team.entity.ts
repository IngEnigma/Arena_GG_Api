export class TournamentTeamEntity {
  constructor(
    public readonly id: number,
    public readonly tournamentId: number,
    public readonly teamId: number,
  ) {}
}
