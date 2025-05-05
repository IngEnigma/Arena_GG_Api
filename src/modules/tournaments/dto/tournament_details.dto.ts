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
  gameName: game_name;
  startDate: Date;
  maxSlots: number;
  mode: tournament_mode;
  rules: string;
  requirements: string;
  prizes: string;
  bracketType: bracket_type;
  status: tournament_status;
  createdAt: Date;
  updatedAt: Date;
  participants: SoloParticipant[] | TeamParticipant[];
}