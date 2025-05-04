import { tournament_mode, bracket_type, tournament_status, game_name } from '@prisma/client';

export interface SoloParticipant {
  id: number;
  username: string;
  email: string;
}

export interface TeamParticipant {
  teamName: string;
  members: SoloParticipant[];
}

export class Tournament {
  id: number;
  name: string;
  game_name: game_name;
  start_date: Date;
  slots: number;
  mode: tournament_mode;
  rules: string;
  requirements: string;
  prizes: string;
  bracket_type: bracket_type;
  status: tournament_status;
  createdAt: Date;
  updatedAt: Date;
  participants: SoloParticipant[] | TeamParticipant[];
}