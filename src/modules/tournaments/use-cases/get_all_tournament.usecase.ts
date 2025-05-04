import { Injectable } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { FilterTournamentsDto } from '../dto/filter_tournaments.dto';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class GetAllTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(
    filters: FilterTournamentsDto,
  ): Promise<Tournament[]> {
    return this.tournamentRepository.findAllTournaments(filters);
  }
}
