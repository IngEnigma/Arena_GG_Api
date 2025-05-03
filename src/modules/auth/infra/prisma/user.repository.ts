import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { UserRepository } from 'src/modules/auth/interfaces/user.repository';
import { User } from 'src/modules/auth/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email ?? (() => { throw new Error('Email is required'); })(),
        username: data.username ?? (() => { throw new Error('Username is required'); })(),
        passwordHash: data.passwordHash ?? (() => { throw new Error('Password hash is required'); })(),
      },
    });

    return new User(
      user.id,
      user.email,
      user.username,
      user.passwordHash,
      user.created_at,
      user.updated_at,
      user.deleted_at,
    );
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.username,
      user.passwordHash,
      user.created_at,
      user.updated_at,
      user.deleted_at,
    );
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.username,
      user.passwordHash,
      user.created_at,
      user.updated_at,
      user.deleted_at,
    );
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.username,
      user.passwordHash,
      user.created_at,
      user.updated_at,
      user.deleted_at,
    );
  }
}
