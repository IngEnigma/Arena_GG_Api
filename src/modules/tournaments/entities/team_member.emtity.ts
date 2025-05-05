export class TeamMemberEntity {
    constructor(
      public readonly id: number,
      public readonly teamId: number,
      public readonly userId: number, 
    ) {}
  }
  