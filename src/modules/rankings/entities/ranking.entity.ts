export class RankingEntity {
  constructor(
    public readonly username: string,
    public readonly matchesPlayed: number,
    public readonly wins: number,
    public readonly points: number,
    public readonly rankPosition: number,
  ) {}
}
