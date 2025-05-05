import {
    bracket_type as PrismaBracketType,
    game_name as PrismaGameName,
    tournament_mode as PrismaTournamentMode,
    tournament_status as PrismaTournamentStatus,
  } from '@prisma/client';
  import { BracketType } from '../enums/bracket_type.enum';
  import { GameName } from '../enums/game_name.enum';
  import { TournamentMode } from '../enums/tournament_mode.enum';
  import { TournamentStatus } from '../enums/tournament_status.enum';
  
  const prismaGameNameMap: Record<PrismaGameName, GameName> = {
    leagueOfLegends: GameName.LeagueOfLegends,
    rocketLeague: GameName.RocketLeague,
    counterStrike: GameName.CounterStrike,
    valorant: GameName.Valorant,
  };
  
  const prismaTournamentModeMap: Record<PrismaTournamentMode, TournamentMode> = {
    solo: TournamentMode.Solo,
    team: TournamentMode.Team,
  };
  
  const prismaBracketTypeMap: Record<PrismaBracketType, BracketType> = {
    singleElimination: BracketType.SingleElimination,
    doubleElimination: BracketType.DoubleElimination,
    freeForAll: BracketType.FreeForAll,
    roundRobin: BracketType.RoundRobin,
    swiss: BracketType.Swiss,
    leaderboard: BracketType.Leaderboard,
  };
  
  const prismaTournamentStatusMap: Record<PrismaTournamentStatus, TournamentStatus> = {
    open: TournamentStatus.Open,
    progress: TournamentStatus.Progress,
    closed: TournamentStatus.Closed,
  };
  
  export function fromPrismaGameName(game: PrismaGameName): GameName {
    const mapped = prismaGameNameMap[game];
    if (!mapped) {
      throw new Error(`Unknown Prisma GameName: ${game}`);
    }
    return mapped;
  }
  
  export function fromPrismaTournamentMode(
    mode: PrismaTournamentMode,
  ): TournamentMode {
    const mapped = prismaTournamentModeMap[mode];
    if (!mapped) {
      throw new Error(`Unknown Prisma TournamentMode: ${mode}`);
    }
    return mapped;
  }
  
  export function fromPrismaBracketType(
    type: PrismaBracketType,
  ): BracketType {
    const mapped = prismaBracketTypeMap[type];
    if (!mapped) {
      throw new Error(`Unknown Prisma BracketType: ${type}`);
    }
    return mapped;
  }
  
  export function fromPrismaTournamentStatus(
    status: PrismaTournamentStatus,
  ): TournamentStatus {
    const mapped = prismaTournamentStatusMap[status];
    if (!mapped) {
      throw new Error(`Unknown Prisma TournamentStatus: ${status}`);
    }
    return mapped;
  }
  