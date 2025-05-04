import { Injectable } from '@nestjs/common';
import { TournamentRepository } from '../../interfaces/tournament.repository';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateTournamentDto } from '../../dto/create_tournament.dto';
import { UpdateTournamentDto } from '../../dto/update_tournament.dto';
import { FilterTournamentsDto } from '../../dto/filter_tournaments.dto';
import { Tournament } from '../../entities/tournament.entity';
import { DateFilter } from 'src/shared/enums/date_filter.enum';
import { tournament_mode} from '@prisma/client';

@Injectable()
export class PrismaTournamentRepository implements TournamentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapFromPrisma(data: any): Tournament {
    const participants = data.mode === tournament_mode.Solo
      ? (data.tournament_participants?.map(p => ({
          id: p.user?.id,
          username: p.user?.username,
          email: p.user?.email,
        })) || [])
      : (data.tournament_teams?.map(entry => ({
          teamName: entry.teams?.name,
          members: entry.teams?.team_members?.map(member => ({
            id: member.user?.id,
            username: member.user?.username,
            email: member.user?.email,
          })) || [],
        })) || []);

    return {
      id: data.id,
      name: data.name,
      game: data.game_name,
      startDate: data.start_date,
      slots: data.max_slots,
      mode: data.mode,
      rules: data.rules ?? '',
      requirements: data.requirements ?? '',
      prizes: data.prizes ?? '',
      bracket: data.bracket_type,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      participants,
    };
  }

  async createTournament(data: CreateTournamentDto): Promise<Tournament> {
    const created = await this.prisma.tournament.create({
      data: {
        name: data.name,
        gameName: data.game_name,
        startDate: data.start_date,
        maxSlots: data.max_slots,
        mode: data.mode,
        rules: data.rules,
        requirements: data.requirements,
        prizes: data.prizes,
        bracketType: data.bracket_type,
        status: data.status,
      },
    });

    return this.mapFromPrisma(created);
  }

  async updateTournament(
    id: number,
    data: UpdateTournamentDto,
  ): Promise<Tournament> {
    const updated = await this.prisma.tournament.update({
      where: { id },
      data: {
        name: data.name,
        gameName: data.game_name,
        startDate: data.start_date,
        maxSlots: data.max_slots,
        mode: data.mode,
        rules: data.rules,
        requirements: data.requirements,
        prizes: data.prizes,
        bracketType: data.bracket_type,
        status: data.status,
        updatedAt: new Date(),
      },
    });

    return this.mapFromPrisma(updated);
  }

  async deleteTournament(id: number): Promise<void> {
    await this.prisma.tournament.delete({
      where: { id },
    });
  }

  async findTournamentById(id: number): Promise<Tournament | null> {
    const found = await this.prisma.tournament.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        teams: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!found) return null;

    return this.mapFromPrisma(found);
  }

  async findAllTournaments(
    filters: FilterTournamentsDto,
  ): Promise<Tournament[]> {
    const where: any = {};

    if (filters.game_name) {
      where.game_name = filters.game_name;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFilter === DateFilter.ThisMonth) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      where.start_date = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    } else if (filters.dateFilter === DateFilter.After) {
      where.start_date = {
        gt: new Date(),
      };
    }

    const tournaments = await this.prisma.tournament.findMany({
      where,
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        teams: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return tournaments.map(t => this.mapFromPrisma(t));
  }
}