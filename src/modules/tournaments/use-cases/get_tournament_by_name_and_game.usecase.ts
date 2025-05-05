import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { Tournament } from '../entities/tournament.entity';
import { game_name } from '@prisma/client';
import { AppLogger } from 'src/shared/logger/logger';  

@Injectable()
export class FindTournamentByNameAndGameUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger, 
  ) {
    this.logger.setContext(FindTournamentByNameAndGameUseCase.name);  
  }

  async execute(name: string, gameName: game_name): Promise<Tournament | null> {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      this.logger.warn('Invalid name provided', { name });
      throw new BadRequestException('Tournament name is required and must be a non-empty string');
    }

    if (!gameName || !(gameName in game_name)) {
      this.logger.warn('Invalid game name provided', { gameName });
      throw new BadRequestException('Invalid game name');
    }

    this.logger.log('Fetching tournament by name and game', { name, gameName });

    const tournament = await this.tournamentRepository.findTournamentByNameAndGame(name, gameName);

    if (!tournament) {
      this.logger.warn(`Tournament with name "${name}" and game "${gameName}" not found`);
      throw new NotFoundException(`Tournament with name "${name}" and game "${gameName}" not found`);
    }

    this.logger.log('Tournament found', { id: tournament.id, name: tournament.name, gameName: tournament.game });

    return tournament;
  }
}
