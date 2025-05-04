import { Injectable, NotFoundException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';

@Injectable()
export class DeleteTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.tournamentRepository.findTournamentById(id);
    if (!existing) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return this.tournamentRepository.deleteTournament(id);
  }
}
