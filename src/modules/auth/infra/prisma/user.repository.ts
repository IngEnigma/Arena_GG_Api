import { UserRepository } from 'src/modules/auth/interfaces/user.repository';
import { PrismaService } from 'src/shared/database/prisma.service';
import { User } from 'src/modules/auth/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { AppLogger } from 'src/shared/logger/logger';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(PrismaUserRepository.name);
  }

  async createUser(data: Partial<User>): Promise<User> {
    this.logger.log('Creating user', { data });

    if (!data.email || !data.username || !data.passwordHash) {
      const errorMsg = 'Email, username, and passwordHash are required';
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const role = data.role && (['admin', 'user'] as const).includes(data.role) ? data.role : 'user'; 
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          passwordHash: data.passwordHash,
          role: role,
        },
      });
      this.logger.log('User created successfully', { userId: user.id });
      return this.mapToDomainModel(user);
    } catch (error) {
      this.logger.error('Error creating user', error.message, { error });
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findUserById(id: number): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) {
        this.logger.log(`User found with ID: ${id}`);
        return this.mapToDomainModel(user);
      } else {
        this.logger.warn(`User not found with ID: ${id}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${id}`, error.message, { error });
      throw new InternalServerErrorException('Error finding user by ID');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        this.logger.log(`User found with email: ${email}`);
        return this.mapToDomainModel(user);
      } else {
        this.logger.warn(`User not found with email: ${email}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error.message, { error });
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    this.logger.log(`Finding user by username: ${username}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (user) {
        this.logger.log(`User found with username: ${username}`);
        return this.mapToDomainModel(user);
      } else {
        this.logger.warn(`User not found with username: ${username}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error finding user by username: ${username}`, error.message, { error });
      throw new InternalServerErrorException('Error finding user by username');
    }
  }

  private mapToDomainModel(user: PrismaUser): User {
    return new User(
      user.id,
      user.email,
      user.username,
      user.passwordHash,
      user.role,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }
}
