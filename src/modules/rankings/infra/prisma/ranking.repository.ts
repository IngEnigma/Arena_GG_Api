import { PrismaService } from 'src/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { GameName } from 'src/shared/enums/game_name.enum';
import { RankingEntity } from '../../entities/ranking.entity';
import { toPrismaGameName } from 'src/shared/mappings/to_prisma_enum.mapper';

@Injectable()
export class RankingRepository implements RankingRepository {
  constructor(private prisma: PrismaService) {}

  async getRankingByGame(game: GameName): Promise<RankingEntity[]> {
    const rankings = await this.prisma.ranking.findMany({
      where: { gameName: toPrismaGameName(game) },
      orderBy: { points: 'desc' },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  
    return rankings.map((ranking, index) => ({
      username: ranking.user.username,
      matchesPlayed: ranking.matchesPlayed,
      wins: ranking.wins,
      points: ranking.points,
      rankPosition: index + 1,
    }));
  }
}
