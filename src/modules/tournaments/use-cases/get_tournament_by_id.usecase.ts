import { Injectable, NotFoundException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class GetTournamentByIdUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findTournamentById(id);
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    return tournament;
  }
}
