import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { AppLogger } from 'src/shared/logger/logger';

@Injectable()
export class SubscribeTeamToTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SubscribeTeamToTournamentUseCase.name);
  }

  async execute(teamId: number, tournamentId: number): Promise<void> {
    if (!teamId || teamId <= 0) {
      this.logger.warn('Invalid team ID provided', { teamId });
      throw new BadRequestException('Invalid team ID');
    }

    if (!tournamentId || tournamentId <= 0) {
      this.logger.warn('Invalid tournament ID provided', { tournamentId });
      throw new BadRequestException('Invalid tournament ID');
    }

    this.logger.log('Executing SubscribeTeamToTournamentUseCase', { teamId, tournamentId });

    const tournament = await this.tournamentRepository.findTournamentById(tournamentId);
    if (!tournament) {
      this.logger.warn(`Tournament with ID ${tournamentId} not found`);
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }

    const team = await this.tournamentRepository.findTeamById(teamId);
    if (!team) {
      this.logger.warn(`Team with ID ${teamId} not found`);
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    await this.tournamentRepository.subscribeTeamToTournament(teamId, tournamentId);

    this.logger.log('Team subscribed to tournament successfully', { teamId, tournamentId });
  }
}
