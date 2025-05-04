import { Injectable, Inject } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { CreateTournamentDto } from '../dto/create_tournament.dto';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class CreateTournamentUseCase {
  constructor(
    @Inject('TournamentRepository')
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  async execute(data: CreateTournamentDto): Promise<Tournament> {
    return this.tournamentRepository.createTournament(data);
  }
}
