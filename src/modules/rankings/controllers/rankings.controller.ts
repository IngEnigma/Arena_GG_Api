import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GameName } from 'src/shared/enums/game_name.enum';
import { AppLogger } from 'src/shared/logger/logger';
import { GetRankingByGameUseCase } from '../use-cases/get_ranking_by_name.usecase';

@Controller('rankings')
export class RankingsController {
  private readonly logger = new AppLogger('RankingsController');

  constructor(private readonly getRankingByGameUseCase: GetRankingByGameUseCase) {}

  @Get()
  async getRanking(@Query('game') game: string) {
    this.logger.log(`Solicitud para ranking del juego: ${game}`);

    if (!game) {
      this.logger.warn('Falta parámetro "game" en la query');
      throw new BadRequestException('El parámetro "game" es obligatorio');
    }

    const isValidGame = Object.values(GameName).includes(game as GameName);
    if (!isValidGame) {
      this.logger.warn(`Juego inválido recibido: ${game}`);
      throw new BadRequestException(
        `Juego inválido. Valores permitidos: ${Object.values(GameName).join(', ')}`,
      );
    }

    try {
      const result = await this.getRankingByGameUseCase.execute(game as GameName);
      this.logger.log(`Ranking enviado correctamente para juego: ${game}`);
      return result;
    } catch (error) {
      this.logger.error('Error en la obtención del ranking', error.stack);
      throw error;
    }
  }
}
