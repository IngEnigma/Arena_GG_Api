import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../interfaces/user.repository';
import { User } from '../entities/user.entity';
import { AppLogger } from 'src/shared/logger/logger';

const SALT_ROUNDS = 10;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(RegisterUserUseCase.name);
  }

  async execute(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    this.logger.log(`Attempting to register user with email: ${email}`);

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      this.logger.warn(`Registration failed: email already in use (${email})`);
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await this.userRepository.createUser({
      username,
      email,
      passwordHash: hashedPassword,
    });

    this.logger.log(`User registered successfully with ID: ${newUser.id}`);
    return newUser;
  }
}
