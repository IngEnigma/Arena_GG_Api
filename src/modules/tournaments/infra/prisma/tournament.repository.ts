import { Injectable } from '@nestjs/common';
import { TournamentRepository } from '../../interfaces/tournament.repository';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateTournamentDto } from '../../dto/create_tournament.dto';
import { UpdateTournamentDto } from '../../dto/update_tournament.dto';
import { FilterTournamentsDto } from '../../dto/filter_tournaments.dto';
import { Tournament } from '../../entities/tournament.entity';
import { DateFilter } from 'src/shared/enums/date_filter.enum';
import { game_name, tournament_mode } from '@prisma/client';
import { BasicTournament } from '../../dto/basic_tournament.dto';
import {
  toPrismaBracketType,
  toPrismaGameName,
  toPrismaTournamentMode,
  toPrismaTournamentStatus,
} from 'src/shared/mappings/to_prisma_enum.mapper';
import { AppLogger } from 'src/shared/logger/logger';
import { TournamentTeamEntity } from '../../entities/tournament_team.entity';
import { TeamMemberEntity } from '../../entities/team_member.emtity';
import { TeamEntity } from '../../entities/team.entity';
import { TournamentParticipantEntity } from '../../entities/tournament_participant.entity';

@Injectable()
export class PrismaTournamentRepository implements TournamentRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(PrismaTournamentRepository.name);
  }

  private mapFromPrisma(data: any): Tournament {
    const participants = data.mode === tournament_mode.solo
      ? data.participants?.map(p => ({
          id: p.user?.id,
          username: p.user?.username,
          email: p.user?.email,
        })) || []
      : data.teams?.map(entry => ({
          teamName: entry.team?.name,
          members: entry.team?.members?.map(member => ({
            id: member.user?.id,
            username: member.user?.username,
            email: member.user?.email,
          })) || [],
        })) || [];

    return new Tournament(
      data.id,
      data.name,
      data.gameName,
      data.startDate,
      data.maxSlots,
      data.mode,
      data.rules,
      data.requirements,
      data.prizes,
      data.bracketType,
      participants,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  private mapToBasicTournament(data: any): BasicTournament {
    return {
      id: data.id,
      name: data.name,
      prizes: data.prizes,
      status: data.status,
    };
  }

  async createTournament(data: CreateTournamentDto): Promise<Tournament> {
    this.logger.log('Creating tournament', { name: data.name });
    const created = await this.prisma.tournament.create({
      data: {
        name: data.name,
        gameName: toPrismaGameName(data.gameName),
        startDate: new Date(data.startDate),
        maxSlots: data.maxSlots,
        mode: toPrismaTournamentMode(data.mode),
        rules: data.rules,
        requirements: data.requirements,
        prizes: data.prizes,
        bracketType: toPrismaBracketType(data.bracketType),
        status: toPrismaTournamentStatus(data.status),
      },
    });
    return this.mapFromPrisma(created);
  }

  async updateTournament(id: number, data: UpdateTournamentDto): Promise<Tournament> {
    this.logger.log('Updating tournament', { id });
    const updated = await this.prisma.tournament.update({
      where: { id },
      data: {
        name: data.name,
        gameName: data.gameName ? toPrismaGameName(data.gameName) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        maxSlots: data.maxSlots,
        mode: data.mode ? toPrismaTournamentMode(data.mode) : undefined,
        rules: data.rules,
        requirements: data.requirements,
        prizes: data.prizes,
        bracketType: data.bracketType ? toPrismaBracketType(data.bracketType) : undefined,
        status: data.status ? toPrismaTournamentStatus(data.status) : undefined,
        updatedAt: new Date(),
      },
    });
    return this.mapFromPrisma(updated);
  }

  async deleteTournament(id: number): Promise<void> {
    this.logger.log('Deleting tournament', { id });
    await this.prisma.tournament.delete({ where: { id } });
  }

  async findTournamentById(id: number): Promise<Tournament | null> {
    this.logger.log('Fetching tournament by ID', { id });
    const found = await this.prisma.tournament.findUnique({
      where: { id },
      include: {
        participants: { include: { user: true } },
        teams: {
          include: {
            team: {
              include: { members: { include: { user: true } } },
            },
          },
        },
      },
    });
    return found ? this.mapFromPrisma(found) : null;
  }

  async findTournamentByNameAndGame(name: string, gameName: game_name): Promise<Tournament | null> {
    this.logger.log('Fetching tournament by name and game', { name, gameName });
    const found = await this.prisma.tournament.findFirst({
      where: { name, gameName },
      include: {
        participants: { include: { user: true } },
        teams: {
          include: {
            team: {
              include: {
                members: { include: { user: true } },
              },
            },
          },
        },
      },
    });
    return found ? this.mapFromPrisma(found) : null;
  }

  async findBasicTournaments(filters: FilterTournamentsDto): Promise<BasicTournament[]> {
    this.logger.log('Fetching basic tournaments with filters', filters);
    const where: any = {};

    if (filters.gameName) where.gameName = toPrismaGameName(filters.gameName);
    if (filters.status) where.status = toPrismaTournamentStatus(filters.status);
    
    if (filters.dateFilter === DateFilter.ThisMonth) {
      const now = new Date();
      where.startDate = {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    } else if (filters.dateFilter === DateFilter.After) {
      where.startDate = { gt: new Date() };
    }

    const tournaments = await this.prisma.tournament.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });

    return tournaments.map(this.mapToBasicTournament); 
  }

  async subscribeUserToTournament(userId: number, tournamentId: number): Promise<void> {
    await this.prisma.tournamentParticipant.create({
      data: { userId, tournamentId },
    });
  }

  async unsubscribeUserFromTournament(userId: number, tournamentId: number): Promise<void> {
    await this.prisma.tournamentParticipant.deleteMany({
      where: { userId, tournamentId },
    });
  }

  async subscribeTeamToTournament(teamId: number, tournamentId: number): Promise<void> {
    await this.prisma.tournamentTeam.create({
      data: { teamId, tournamentId },
    });
  }

  async unsubscribeTeamFromTournament(teamId: number, tournamentId: number): Promise<void> {
    await this.prisma.tournamentTeam.deleteMany({
      where: { teamId, tournamentId },
    });
  }

  async findUserSubscription(userId: number, tournamentId: number) {
    return this.prisma.tournamentParticipant.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });
  }

  async findTeamSubscription(teamId: number, tournamentId: number) {
    return this.prisma.tournamentTeam.findUnique({
      where: { tournamentId_teamId: { tournamentId, teamId } },
    });
  }

  async findTeamById(teamId: number): Promise<TeamEntity | null> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
        entries: true, 
      },
    });
  
    if (!team) return null;
  
    const members: TeamMemberEntity[] = team.members.map(
      (m) => new TeamMemberEntity(m.id, m.teamId, m.userId)
    );
  
    const entries: TournamentTeamEntity[] = team.entries.map(
      (tt) => new TournamentTeamEntity(tt.id, tt.teamId, tt.tournamentId)
    );
  
    return new TeamEntity(team.id, team.name, members, entries, team.createdAt);
  }

  async findUserById(userParticipantId: number): Promise<TournamentParticipantEntity | null> {
    const participant = await this.prisma.tournamentParticipant.findUnique({
      where: { id: userParticipantId },
    });
  
    if (!participant) return null;
  
    return new TournamentParticipantEntity(
      participant.id,
      participant.tournamentId,
      participant.userId,
    );
  }   
}