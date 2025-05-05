import { Injectable, BadRequestException } from '@nestjs/common';
import { GameName } from 'src/shared/enums/game_name.enum';
import { RankingEntity } from '../entities/ranking.entity';
import { AppLogger } from 'src/shared/logger/logger';
import { RankingRepository } from '../infra/prisma/ranking.repository';

@Injectable()
export class GetRankingByGameUseCase {
  private readonly logger: AppLogger;

  constructor(
    private readonly rankingRepository: RankingRepository,
  ) {
    this.logger = new AppLogger('GetRankingByGameUseCase');
  }

  async execute(game: GameName): Promise<RankingEntity[]> {
    this.logger.log(`Obteniendo ranking para el juego: ${game}`);

    const validGames = Object.values(GameName);
    if (!validGames.includes(game)) {
      this.logger.warn(`Juego no válido: ${game}`);
      throw new BadRequestException(`El juego "${game}" no es válido.`);
    }

    try {
      const rankings = await this.rankingRepository.getRankingByGame(game);
      this.logger.log(`Ranking obtenido. Total jugadores: ${rankings.length}`);
      return rankings;
    } catch (error) {
      this.logger.error('Error al obtener el ranking', error.stack);
      throw error;
    }
  }
}
