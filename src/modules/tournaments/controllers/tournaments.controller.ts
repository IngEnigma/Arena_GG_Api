// src/modules/tournaments/controllers/tournaments.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetAllTournamentUseCase } from '../use-cases/get_all_tournament.usecase';
import { GetTournamentByIdUseCase } from '../use-cases/get_tournament_by_id.usecase';
import { FilterTournamentsDto } from '../dto/filter_tournaments.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly getAllTournaments: GetAllTournamentUseCase,
    private readonly getTournamentById: GetTournamentByIdUseCase,
  ) {}

  @Get()
  async getAll(@Query() filters: FilterTournamentsDto) {
    return this.getAllTournaments.execute(filters);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.getTournamentById.execute(+id);
  }
}
