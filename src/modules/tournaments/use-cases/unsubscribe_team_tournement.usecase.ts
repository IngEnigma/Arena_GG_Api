import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { AppLogger } from 'src/shared/logger/logger';

@Injectable()
export class UnsubscribeTeamFromTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UnsubscribeTeamFromTournamentUseCase.name);
  }

  async execute(teamId: number, tournamentId: number): Promise<void> {
    this.logger.log('Executing UnsubscribeTeamFromTournamentUseCase', { teamId, tournamentId });

    const tournament = await this.tournamentRepository.findTournamentById(tournamentId);
    if (!tournament) {
      this.logger.warn('Tournament not found', { tournamentId });
      throw new NotFoundException('El torneo no existe');
    }

    const existingSubscription = await this.tournamentRepository.findTeamSubscription(teamId, tournamentId);
    if (!existingSubscription) {
      this.logger.warn('Team not subscribed to tournament', { teamId, tournamentId });
      throw new BadRequestException('El equipo no está inscrito en este torneo');
    }

    await this.tournamentRepository.unsubscribeTeamFromTournament(teamId, tournamentId);

    this.logger.log('Team unsubscribed from tournament successfully', { teamId, tournamentId });
  }
}
