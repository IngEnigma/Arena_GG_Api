import { Module } from '@nestjs/common';
import { TournamentsController } from './controllers/tournaments.controller';
import { AdminTournamentsController } from './controllers/admin-tournaments.controller';

@Module({
  controllers: [TournamentsController, AdminTournamentsController]
})
export class TournamentsModule {}
