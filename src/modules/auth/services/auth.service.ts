import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRepository } from '../interfaces/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.userRepository.createUser(data);
  }

  async findUserById(id: number) {
    return this.userRepository.findUserById(id);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }

  async findUserByUsername(username: string) {
    return this.userRepository.findUserByUsername(username);
  }
}
