import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { AppLogger } from 'src/shared/logger/logger';
import { TournamentStatus } from 'src/shared/enums/tournament_status.enum';

@Injectable()
export class SubscribeUserToTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SubscribeUserToTournamentUseCase.name);
  }

  async execute(userId: number, tournamentId: number): Promise<void> {
    this.logger.log('Start subscribing user to tournament', { userId, tournamentId });

    const tournament = await this.tournamentRepository.findTournamentById(tournamentId);
    if (!tournament) {
      this.logger.warn('Tournament not found', { tournamentId });
      throw new NotFoundException('El torneo no existe');
    }

    const existingSubscription = await this.tournamentRepository.findUserSubscription(userId, tournamentId);
    if (existingSubscription) {
      this.logger.warn('User already subscribed to tournament', { userId, tournamentId });
      throw new BadRequestException('El usuario ya está inscrito en este torneo');
    }

    if (tournament.status !== TournamentStatus.Open) {
      this.logger.warn('Tournament not open for registration', { tournamentId, status: tournament.status });
      throw new BadRequestException('El torneo no está abierto para inscripciones');
    }

    await this.tournamentRepository.subscribeUserToTournament(userId, tournamentId);

    this.logger.log('User subscribed to tournament successfully', { userId, tournamentId });
  }
}
