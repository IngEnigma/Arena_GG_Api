import { Injectable, NotFoundException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { UpdateTournamentDto } from '../dto/update_tournament.dto';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class UpdateTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(id: number, data: UpdateTournamentDto): Promise<Tournament> {
    const existing = await this.tournamentRepository.findTournamentById(id);
    if (!existing) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return this.tournamentRepository.updateTournament(id, data);
  }
}
