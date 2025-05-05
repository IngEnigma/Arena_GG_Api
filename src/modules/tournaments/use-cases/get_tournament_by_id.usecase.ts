import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { Tournament } from '../entities/tournament.entity';
import { AppLogger } from 'src/shared/logger/logger';  

@Injectable()
export class GetTournamentByIdUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger,  
  ) {
    this.logger.setContext(GetTournamentByIdUseCase.name);  
  }

  async execute(id: number): Promise<Tournament> {
    if (!id || isNaN(id) || id <= 0) {
      this.logger.warn('Invalid tournament ID provided', { id });
      throw new BadRequestException('Invalid tournament ID');
    }

    this.logger.log('Fetching tournament by ID', { id });  

    const tournament = await this.tournamentRepository.findTournamentById(id);
    if (!tournament) {
      this.logger.warn(`Tournament with ID ${id} not found`);  
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    this.logger.log('Tournament found', { id, name: tournament.name });  

    return tournament;
  }
}
