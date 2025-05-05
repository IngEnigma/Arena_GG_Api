import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CreateTournamentUseCase } from '../use-cases/create_tournament.usecase';
import { UpdateTournamentUseCase } from '../use-cases/update_tournament.usecase';
import { DeleteTournamentUseCase } from '../use-cases/delete_tournament.usecase';
import { CreateTournamentDto } from '../dto/create_tournament.dto';
import { UpdateTournamentDto } from '../dto/update_tournament.dto';
import { AppLogger } from 'src/shared/logger/logger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/auth.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt_auth.guard';
import { UnsubscribeTeamFromTournamentUseCase } from '../use-cases/unsubscribe_team_tournement.usecase';
import { UnsubscribeUserFromTournamentUseCase } from '../use-cases/unsubscribe_user_tournament.usecase';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin-tournaments')
export class AdminTournamentsController {
  constructor(
    private readonly createTournament: CreateTournamentUseCase,
    private readonly updateTournament: UpdateTournamentUseCase,
    private readonly deleteTournament: DeleteTournamentUseCase,
    private readonly unsubscribeTeamFromTournament: UnsubscribeTeamFromTournamentUseCase,
    private readonly unsubscribeUserFromTournament: UnsubscribeUserFromTournamentUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateTournamentDto) {
    this.logger.log('Creating new tournament', { tournamentData: dto });
    try {
      const tournament = await this.createTournament.execute(dto);
      this.logger.log('Tournament created successfully', { tournamentId: tournament.id });
      return tournament;
    } catch (error) {
      this.logger.error('Failed to create tournament', error.message, { error: error.message });
      throw new BadRequestException('Failed to create tournament');
    }
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() dto: UpdateTournamentDto) {
    this.logger.log(`Updating tournament with ID ${id}`, { tournamentData: dto });
    try {
      const updatedTournament = await this.updateTournament.execute(+id, dto);
      this.logger.log('Tournament updated successfully', { tournamentId: updatedTournament.id });
      return updatedTournament;
    } catch (error) {
      this.logger.error(`Failed to update tournament with ID ${id}`, error.message, { error: error.message });
      throw new InternalServerErrorException('An unexpected error occurred while updating the tournament');
    }
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number) {
    this.logger.log(`Deleting tournament with ID ${id}`);
    try {
      await this.deleteTournament.execute(+id);
      this.logger.log(`Tournament with ID ${id} successfully deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete tournament with ID ${id}`, error.message, { error: error.message });
      throw new InternalServerErrorException('An unexpected error occurred while deleting the tournament');
    }
  }

  @Post(':id/unsubscribe/team')
  @Roles('admin')
  async unsubscribeTeam(
    @Param('id') tournamentId: string,
    @Body('teamId') teamId: number,
  ) {
    this.logger.log('Unsubscribing team from tournament', { tournamentId, teamId });
    try {
      await this.unsubscribeTeamFromTournament.execute(+teamId, +tournamentId);
      this.logger.log('Team unsubscribed from tournament successfully', { tournamentId, teamId });
    } catch (error) {
      this.logger.error('Failed to unsubscribe team from tournament', error.message, { error: error.message });
      throw new BadRequestException('Failed to unsubscribe team from tournament');
    }
  }

  @Post(':id/unsubscribe/user')
  @Roles('admin')
  async unsubscribeUser(
    @Param('id') tournamentId: string,
    @Body('userId') userId: number,
  ) { 
    this.logger.log('Unsubscribing user from tournament', { tournamentId, userId });
    try {
      await this.unsubscribeUserFromTournament.execute(+userId, +tournamentId);
      this.logger.log('User unsubscribed from tournament successfully', { tournamentId, userId });
    } catch (error) {
      this.logger.error('Failed to unsubscribe user from tournament', error.message, { error: error.message });
      throw new BadRequestException('Failed to unsubscribe user from tournament');
    }
  }
}
