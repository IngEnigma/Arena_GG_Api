import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { RankingsModule } from './modules/rankings/rankings.module';
import { PrismaModule } from './shared/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './shared/guards/auth.guard';
import { AppController } from './app.controller';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './shared/guards/jwt_auth.guard';

@Module({
  imports: [PrismaModule, AuthModule, RankingsModule, TournamentsModule],
  controllers: [AppController],
  providers: [
    Reflector, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
