import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../interfaces/user.repository';
import { AppLogger } from 'src/shared/logger/logger';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(LoginUserUseCase.name);
  }

  async execute(email: string, password: string): Promise<{ access_token: string }> {
    this.logger.log(`Attempting login for email: ${email}`);

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      this.logger.warn(`User not found for email: ${email}`);
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for email: ${email}`);
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Login successful for user ID: ${user.id}`);
    return { access_token: token };
  }
}
