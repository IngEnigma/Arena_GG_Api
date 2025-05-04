// src/modules/tournaments/controllers/admin-tournaments.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CreateTournamentUseCase } from '../use-cases/create_tournament.usecase';
import { UpdateTournamentUseCase } from '../use-cases/update_tournament.usecase';
import { DeleteTournamentUseCase } from '../use-cases/delete_tournament.usecase';
import { CreateTournamentDto } from '../dto/create_tournament.dto';
import { UpdateTournamentDto } from '../dto/update_tournament.dto';

@Controller('admin-tournaments')
export class AdminTournamentsController {
  constructor(
    private readonly createTournament: CreateTournamentUseCase,
    private readonly updateTournament: UpdateTournamentUseCase,
    private readonly deleteTournament: DeleteTournamentUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateTournamentDto) {
    return this.createTournament.execute(dto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTournamentDto) {
    return this.updateTournament.execute(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.deleteTournament.execute(+id);
  }
}
