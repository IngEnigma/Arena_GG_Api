import { Injectable } from '@nestjs/common';
import { TournamentRepository } from 'src/modules/tournaments/interfaces/tournament.repository';
import { FilterTournamentsDto } from 'src/modules/tournaments/dto/filter_tournaments.dto';
import { BasicTournament } from 'src/modules/tournaments/dto/basic_tournament.dto';
import { DateFilter } from 'src/shared/enums/date_filter.enum';
import { AppLogger } from 'src/shared/logger/logger';
import { tournament_status, game_name } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class GetBasicTournamentsUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger, 
  ) {}

  async execute(filters: FilterTournamentsDto): Promise<BasicTournament[]> {
    if (filters.status && !(filters.status in tournament_status)) {
      this.logger.warn('Invalid status filter', { status: filters.status });
      throw new BadRequestException('Invalid status filter');
    }

    if (filters.gameName && !(filters.gameName in game_name)) {
      this.logger.warn('Invalid gameName filter', { gameName: filters.gameName });
      throw new BadRequestException('Invalid gameName filter');
    }

    if (filters.dateFilter && !Object.values(DateFilter).includes(filters.dateFilter)) {
      this.logger.warn('Invalid dateFilter', { dateFilter: filters.dateFilter });
      throw new BadRequestException('Invalid dateFilter');
    }

    this.logger.log('Fetching basic tournaments with filters', filters);

    try {
      const tournaments = await this.tournamentRepository.findBasicTournaments(filters);
      this.logger.log('Fetched basic tournaments', { count: tournaments.length });

      return tournaments;
    } catch (error) {
      this.logger.error('Error fetching basic tournaments', error.stack);
      throw error; 
    }
  }
}
