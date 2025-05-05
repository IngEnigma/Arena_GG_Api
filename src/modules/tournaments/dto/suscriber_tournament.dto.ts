import { IsInt } from 'class-validator';

export class SubscribeTournamentDto {
  @IsInt()
  tournamentId: number;
}