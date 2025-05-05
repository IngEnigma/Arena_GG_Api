import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { AppLogger } from 'src/shared/logger/logger'; 

@Injectable()
export class DeleteTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository, 
    private readonly logger: AppLogger,  
  ) {
    this.logger.setContext(DeleteTournamentUseCase.name); 
  }

  async execute(id: number): Promise<void> {
    this.logger.log('Executing tournament deletion', { tournamentId: id });  

    if (!id || id <= 0) {
      this.logger.warn(`Invalid tournament ID: ${id}`);  
      throw new BadRequestException('Invalid tournament ID');
    }

    const existing = await this.tournamentRepository.findTournamentById(id);
    if (!existing) {
      this.logger.warn(`Tournament with ID ${id} not found`);  
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    try {
      await this.tournamentRepository.deleteTournament(id);
      this.logger.log(`Tournament with ID ${id} successfully deleted`);  
    } catch (error) {
      this.logger.error(`Failed to delete tournament with ID ${id}: ${error.message}`, error.stack);  
      throw new InternalServerErrorException('An unexpected error occurred while deleting the tournament'); 
    }
  }
}
