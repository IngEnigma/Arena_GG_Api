import { Module } from '@nestjs/common';
import { TournamentsController } from './controllers/tournaments.controller';
import { AdminTournamentsController } from './controllers/admin-tournaments.controller';
import { CreateTournamentUseCase } from './use-cases/create_tournament.usecase';
import { UpdateTournamentUseCase } from './use-cases/update_tournament.usecase';
import { DeleteTournamentUseCase } from './use-cases/delete_tournament.usecase';
import { GetAllTournamentUseCase } from './use-cases/get_all_tournament.usecase';
import { GetTournamentByIdUseCase } from './use-cases/get_tournament_by_id.usecase';
import { PrismaTournamentRepository } from './infra/prisma/tournament.repository';

@Module({
  controllers: [TournamentsController, AdminTournamentsController],
  providers: [
    CreateTournamentUseCase,
    UpdateTournamentUseCase,
    DeleteTournamentUseCase,
    GetAllTournamentUseCase,
    GetTournamentByIdUseCase,
    {
      provide: 'TournamentRepository',
      useClass: PrismaTournamentRepository,
    }
  ],
})
export class TournamentsModule {}
