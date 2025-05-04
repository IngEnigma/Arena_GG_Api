import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create_tournament.dto';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {}