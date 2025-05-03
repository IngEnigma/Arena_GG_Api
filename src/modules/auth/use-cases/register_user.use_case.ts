import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../interfaces/user.repository';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository
  ) {}

  async execute(username: string, email: string, password: string) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.createUser({
      username,
      email,
      passwordHash: hashedPassword,
    });
  }
}
