export class User {
    constructor(
      public readonly id: number, 
      public readonly email: string,
      public readonly username: string,
      public readonly passwordHash: string, 
      public readonly createdAt?: Date,
      public readonly updatedAt?: Date,
      public readonly deletedAt?: Date | null,
    ) {}
  }
  
