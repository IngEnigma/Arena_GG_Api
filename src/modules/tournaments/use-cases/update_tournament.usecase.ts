import { Injectable, NotFoundException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { UpdateTournamentDto } from '../dto/update_tournament.dto';
import { Tournament } from '../entities/tournament.entity';
import { AppLogger } from 'src/shared/logger/logger';  

@Injectable()
export class UpdateTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger, 
  ) {
    this.logger.setContext(UpdateTournamentUseCase.name);  
  }

  async execute(id: number, data: UpdateTournamentDto): Promise<Tournament> {
    this.logger.log('Executing tournament update', { tournamentId: id, updateData: data });  

    const existing = await this.tournamentRepository.findTournamentById(id);
    if (!existing) {
      this.logger.warn('Tournament not found', { tournamentId: id });
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    this.logger.log('Tournament found, proceeding with update', { tournamentId: id });

    const updatedTournament = await this.tournamentRepository.updateTournament(id, data);
    this.logger.log('Tournament updated successfully', { tournamentId: updatedTournament.id });

    return updatedTournament;
  }
}
