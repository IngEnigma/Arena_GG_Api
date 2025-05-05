export class TournamentParticipantEntity {
  constructor(
    public readonly id: number,
    public readonly tournamentId: number,
    public readonly userId: number,
  ) {}
}
