import { tournament_status } from '@prisma/client';

export class BasicTournament {
  id: number;
  name: string;
  prizes: string;
  status: tournament_status;
}