import { IsEnum } from 'class-validator';
import { GameName } from 'src/shared/enums/game_name.enum';

export class GetRankingDto {
  @IsEnum(GameName)
  gameName: GameName;
}
