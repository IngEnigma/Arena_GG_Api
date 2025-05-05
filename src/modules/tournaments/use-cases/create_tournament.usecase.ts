import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { TournamentRepository } from '../interfaces/tournament.repository';
import { CreateTournamentDto } from '../dto/create_tournament.dto';
import { Tournament } from '../entities/tournament.entity';
import { toPrismaGameName, toPrismaTournamentMode } from 'src/shared/mappings/to_prisma_enum.mapper';
import { AppLogger } from 'src/shared/logger/logger';

@Injectable()
export class CreateTournamentUseCase {
  constructor(
    @Inject('TournamentRepository')
    private readonly tournamentRepository: TournamentRepository,
    private readonly logger: AppLogger,  
  ) {
    this.logger.setContext(CreateTournamentUseCase.name); 
  }

  async execute(data: CreateTournamentDto): Promise<Tournament> {
    try {
      this.logger.log('Executing tournament creation', { tournamentData: data }); 

      if (!data.name || !data.gameName) {
        this.logger.warn('Missing required fields for tournament creation', { name: data.name, gameName: data.gameName });
        throw new BadRequestException('Name and GameName are required');
      }

      if (new Date(data.startDate) < new Date()) {
        this.logger.warn('Start date cannot be in the past', { startDate: data.startDate });
        throw new BadRequestException('The start date must be in the future');
      }

      if (data.maxSlots <= 0) {
        this.logger.warn('Max slots must be a positive integer', { maxSlots: data.maxSlots });
        throw new BadRequestException('Max slots must be greater than 0');
      }

      if (!data.mode || !['solo', 'teams'].includes(data.mode)) {
        this.logger.warn('Invalid tournament mode', { mode: data.mode });
        throw new BadRequestException('Tournament mode must be either "solo" or "teams"');
      }

      const prismaGameName = toPrismaGameName(data.gameName);
      this.logger.log('Mapped game name for Prisma', { gameName: prismaGameName });

      const existingTournament = await this.tournamentRepository.findTournamentByNameAndGame(data.name, prismaGameName);
      if (existingTournament) {
        this.logger.warn('Tournament already exists with the same name and game', { name: data.name, gameName: prismaGameName });
        throw new BadRequestException('A tournament with the same name and game already exists');
      }

      const createdTournament = await this.tournamentRepository.createTournament(data);
      this.logger.log('Tournament created successfully', { tournamentId: createdTournament.id, name: data.name });

      return createdTournament;
    } catch (error) {
      this.logger.error('Error occurred while creating tournament', error.message, { stack: error.stack });
      throw new Error(`Error creating tournament: ${error.message}`);
    }
  }
}
