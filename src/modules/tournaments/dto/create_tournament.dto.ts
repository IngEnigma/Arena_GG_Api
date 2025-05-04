import {
    IsString,
    IsDateString,
    IsEnum,
    IsInt,
    Min,
  } from 'class-validator';
  import { GameName } from 'src/shared/enums/game_name.enum';
  import { TournamentMode } from 'src/shared/enums/tournament_mode.enum';
  import { BracketType } from 'src/shared/enums/bracket_type.enum';
  import { TournamentStatus } from 'src/shared/enums/tournament_status.enum';
  
  export class CreateTournamentDto {
    @IsEnum(GameName)
    game_name: GameName;
  
    @IsString()
    name: string;
  
    @IsDateString()
    start_date: string;
  
    @IsInt()
    @Min(2)
    max_slots: number;
  
    @IsEnum(TournamentMode)
    mode: TournamentMode;
  
    @IsEnum(BracketType)
    bracket_type: BracketType;
  
    @IsEnum(TournamentStatus)
    status: TournamentStatus;
  
    @IsString()
    rules: string;
  
    @IsString()
    requirements: string;
  
    @IsString()
    prizes: string;
  }
  