import { Controller, Get, Post, Param, Body, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { GetTournamentByIdUseCase } from '../use-cases/get_tournament_by_id.usecase';
import { GetBasicTournamentsUseCase } from '../use-cases/get_basic_tournament.usecase'; 
import { SubscribeTeamToTournamentUseCase } from '../use-cases/subscribe_team_tournament.usecase';
import { SubscribeUserToTournamentUseCase } from '../use-cases/subscribe_user_tournament.usecase';
import { FilterTournamentsDto } from '../dto/filter_tournaments.dto';
import { AppLogger } from 'src/shared/logger/logger'; 
import { Roles } from 'src/shared/decorators/roles.decorator'; 
import { RolesGuard } from 'src/shared/guards/auth.guard'; 
import { UseGuards } from '@nestjs/common'; 

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly getTournamentById: GetTournamentByIdUseCase,
    private readonly getBasicTournaments: GetBasicTournamentsUseCase,  
    private readonly subscribeTeamToTournament: SubscribeTeamToTournamentUseCase,
    private readonly subscribeUserToTournament: SubscribeUserToTournamentUseCase,
    private readonly logger: AppLogger, 
  ) {
    this.logger.setContext(TournamentsController.name);  
  }

  @Get()
  async getBasic(@Query() filters: FilterTournamentsDto) {
    this.logger.log('Fetching basic tournaments', { filters });
    try {
      const tournaments = await this.getBasicTournaments.execute(filters);
      this.logger.log('Basic tournaments fetched successfully', { count: tournaments.length });
      return tournaments;
    } catch (error) {
      this.logger.error('Failed to fetch basic tournaments', error.message, { error: error.message });
      throw new BadRequestException('Could not fetch basic tournaments');
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const tournamentId = parseInt(id, 10);

    if (isNaN(tournamentId)) {
      this.logger.warn(`Invalid tournament ID: ${id}`);
      throw new NotFoundException('Invalid tournament ID');
    }

    this.logger.log('Fetching tournament by ID', { tournamentId });
    try {
      const tournament = await this.getTournamentById.execute(tournamentId);
      this.logger.log('Tournament fetched successfully', { tournamentId });
      return tournament;
    } catch (error) {
      this.logger.error(`Failed to fetch tournament with ID ${tournamentId}`, error.message, { error: error.message });
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }
  }

  @Post(':id/subscribe/team')
  @Roles('user') 
  @UseGuards(RolesGuard) 
  async subscribeTeam(
    @Param('id') tournamentId: string,
    @Body('teamId') teamId: number,
  ) {
    const tournamentIdInt = parseInt(tournamentId, 10);

    if (isNaN(tournamentIdInt)) {
      this.logger.warn(`Invalid tournament ID: ${tournamentId}`);
      throw new NotFoundException('Invalid tournament ID');
    }

    this.logger.log('Subscribing team to tournament', { teamId, tournamentId: tournamentIdInt });

    try {
      await this.subscribeTeamToTournament.execute(teamId, tournamentIdInt);
      this.logger.log('Team subscribed to tournament successfully', { teamId, tournamentId: tournamentIdInt });
      return { message: 'Team subscribed successfully' };
    } catch (error) {
      this.logger.error('Failed to subscribe team to tournament', error.message, { error: error.message });
      throw new BadRequestException('Could not subscribe team to tournament');
    }
  }

  @Post(':id/subscribe/user')
  @Roles('user') 
  @UseGuards(RolesGuard) 
  async subscribeUser(
    @Param('id') tournamentId: string,
    @Body('userId') userId: number,
  ) {
    const tournamentIdInt = parseInt(tournamentId, 10);

    if (isNaN(tournamentIdInt)) {
      this.logger.warn(`Invalid tournament ID: ${tournamentId}`);
      throw new NotFoundException('Invalid tournament ID');
    }

    this.logger.log('Subscribing user to tournament', { userId, tournamentId: tournamentIdInt });

    try {
      await this.subscribeUserToTournament.execute(userId, tournamentIdInt);
      this.logger.log('User subscribed to tournament successfully', { userId, tournamentId: tournamentIdInt });
      return { message: 'User subscribed successfully' };
    } catch (error) {
      this.logger.error('Failed to subscribe user to tournament', error.message, { error: error.message });
      throw new BadRequestException('Could not subscribe user to tournament');
    }
  }
}
