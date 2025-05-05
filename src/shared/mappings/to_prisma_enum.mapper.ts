import { game_name, bracket_type, tournament_mode, tournament_status } from '@prisma/client';
import { GameName } from '../enums/game_name.enum';
import { BracketType } from '../enums/bracket_type.enum';
import { TournamentMode } from '../enums/tournament_mode.enum';
import { TournamentStatus } from '../enums/tournament_status.enum';

const gameNameMap: Record<GameName, game_name> = {
  [GameName.LeagueOfLegends]: game_name.leagueOfLegends,
  [GameName.RocketLeague]: game_name.rocketLeague,
  [GameName.CounterStrike]: game_name.counterStrike,
  [GameName.Valorant]: game_name.valorant,
};

const bracketTypeMap: Record<BracketType, bracket_type> = {
  [BracketType.SingleElimination]: bracket_type.singleElimination,
  [BracketType.DoubleElimination]: bracket_type.doubleElimination,
  [BracketType.FreeForAll]: bracket_type.freeForAll,
  [BracketType.RoundRobin]: bracket_type.roundRobin,
  [BracketType.Swiss]: bracket_type.swiss,
  [BracketType.Leaderboard]: bracket_type.leaderboard,
};

const tournamentModeMap: Record<TournamentMode, tournament_mode> = {
  [TournamentMode.Solo]: tournament_mode.solo,
  [TournamentMode.Team]: tournament_mode.team,
};

const tournamentStatusMap: Record<TournamentStatus, tournament_status> = {
  [TournamentStatus.Open]: tournament_status.open,
  [TournamentStatus.Progress]: tournament_status.progress,
  [TournamentStatus.Closed]: tournament_status.closed,
};

export const toPrismaGameName = (game: GameName): game_name => gameNameMap[game];
export const toPrismaBracketType = (bracket: BracketType): bracket_type => bracketTypeMap[bracket];
export const toPrismaTournamentMode = (mode: TournamentMode): tournament_mode => tournamentModeMap[mode];
export const toPrismaTournamentStatus = (status: TournamentStatus): tournament_status => tournamentStatusMap[status];