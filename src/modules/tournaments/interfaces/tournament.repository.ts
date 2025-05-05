import { TournamentParticipantEntity } from '../entities/tournament_participant.entity';
import { TournamentTeamEntity } from '../entities/tournament_team.entity';
import { FilterTournamentsDto } from '../dto/filter_tournaments.dto';
import { CreateTournamentDto } from '../dto/create_tournament.dto';
import { UpdateTournamentDto } from '../dto/update_tournament.dto';
import { BasicTournament } from '../dto/basic_tournament.dto';
import { Tournament } from '../entities/tournament.entity';
import { TeamEntity } from '../entities/team.entity';
import { game_name } from '@prisma/client';

export interface TournamentRepository {
  createTournament(data: CreateTournamentDto): Promise<Tournament>;
  updateTournament(id: number, data: UpdateTournamentDto): Promise<Tournament>;
  deleteTournament(id: number): Promise<void>;
  findTournamentById(id: number): Promise<Tournament | null>;
  findTournamentByNameAndGame(name: string, gameName: game_name): Promise<Tournament | null>;
  findBasicTournaments(filters: FilterTournamentsDto): Promise<BasicTournament[]>;
  subscribeUserToTournament(userId: number, tournamentId: number): Promise<void>;
  unsubscribeUserFromTournament(userId: number, tournamentId: number): Promise<void>;
  subscribeTeamToTournament(teamId: number, tournamentId: number): Promise<void>;
  unsubscribeTeamFromTournament(teamId: number, tournamentId: number): Promise<void>;
  findUserSubscription(userId: number, tournamentId: number): Promise<TournamentParticipantEntity | null>;
  findTeamSubscription(teamId: number, tournamentId: number): Promise<TournamentTeamEntity | null>;
  findTeamById(teamId: number): Promise<TeamEntity | null>;
  findUserById(userId: number): Promise<TournamentParticipantEntity | null>;
}
