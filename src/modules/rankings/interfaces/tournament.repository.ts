import { GameName } from "src/shared/enums/game_name.enum";
import { RankingEntity } from "../entities/ranking.entity";

export interface RankingRepository {
  getRankingByGame(game: GameName): Promise<RankingEntity[]>;
}