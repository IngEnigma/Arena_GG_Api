import { User } from '../entities/user.entity';

export interface UserRepository {
  createUser(data: Partial<User>): Promise<User>;
  findUserById(id: number): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
}
