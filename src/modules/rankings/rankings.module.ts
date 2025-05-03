import { Module } from '@nestjs/common';
import { RankingsController } from './controllers/rankings.controller';

@Module({
  controllers: [RankingsController]
})
export class RankingsModule {}
