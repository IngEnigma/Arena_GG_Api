import { UserEntity } from '../../modules/auth/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      username: string;
    }
  }
}