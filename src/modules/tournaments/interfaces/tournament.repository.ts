import { CreateTournamentDto } from '../dto/create_tournament.dto';
import { UpdateTournamentDto } from '../dto/update_tournament.dto';
import { FilterTournamentsDto } from '../dto/filter_tournaments.dto';
import { Tournament } from '../entities/tournament.entity';

export interface TournamentRepository {
  createTournament(data: CreateTournamentDto): Promise<Tournament>;
  updateTournament(id: number, data: UpdateTournamentDto): Promise<Tournament>;
  deleteTournament(id: number): Promise<void>;
  findTournamentById(id: number): Promise<Tournament | null>;
  findAllTournaments(filters: FilterTournamentsDto): Promise<Tournament[]>;
}
