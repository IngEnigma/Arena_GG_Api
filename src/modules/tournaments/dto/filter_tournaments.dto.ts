import { IsEnum, IsOptional } from 'class-validator';
import { GameName } from 'src/shared/enums/game_name.enum';
import { TournamentStatus } from 'src/shared/enums/tournament_status.enum';
import { DateFilter } from 'src/shared/enums/date_filter.enum';

export class FilterTournamentsDto {
  @IsOptional()
  @IsEnum(GameName)
  gameName?: GameName;

  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;

  @IsOptional()
  @IsEnum(DateFilter)
  dateFilter?: DateFilter;
}
