import { Get, Module } from '@nestjs/common';
import { TournamentsController } from './controllers/tournaments.controller';
import { AdminTournamentsController } from './controllers/admin-tournaments.controller';
import { CreateTournamentUseCase } from './use-cases/create_tournament.usecase';
import { UpdateTournamentUseCase } from './use-cases/update_tournament.usecase';
import { DeleteTournamentUseCase } from './use-cases/delete_tournament.usecase';
import { GetTournamentByIdUseCase } from './use-cases/get_tournament_by_id.usecase';
import { PrismaTournamentRepository } from './infra/prisma/tournament.repository';
import { GetBasicTournamentsUseCase } from './use-cases/get_basic_tournament.usecase';
import { SubscribeTeamToTournamentUseCase } from './use-cases/subscribe_team_tournament.usecase';
import { SubscribeUserToTournamentUseCase } from './use-cases/subscribe_user_tournament.usecase';
import { UnsubscribeTeamFromTournamentUseCase } from './use-cases/unsubscribe_team_tournement.usecase';
import { UnsubscribeUserFromTournamentUseCase } from './use-cases/unsubscribe_user_tournament.usecase';
import { FindTournamentByNameAndGameUseCase } from './use-cases/get_tournament_by_name_and_game.usecase';

@Module({
  controllers: [TournamentsController, AdminTournamentsController],
  providers: [
    CreateTournamentUseCase,
    UpdateTournamentUseCase,
    DeleteTournamentUseCase,
    GetTournamentByIdUseCase,
    GetBasicTournamentsUseCase,
    SubscribeTeamToTournamentUseCase,
    SubscribeUserToTournamentUseCase,
    UnsubscribeTeamFromTournamentUseCase,
    UnsubscribeUserFromTournamentUseCase,
    FindTournamentByNameAndGameUseCase,
    {
      provide: 'TournamentRepository',
      useClass: PrismaTournamentRepository,
    }
  ],
})
export class TournamentsModule {}
