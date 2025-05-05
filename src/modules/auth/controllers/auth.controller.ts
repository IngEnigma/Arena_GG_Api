import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserUseCase } from '../use-cases/register_user.usecase';
import { LoginUserUseCase } from '../use-cases/login_user.usecase';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../../../shared/decorators/public.decorator';
import { AppLogger } from 'src/shared/logger/logger';

@Controller('auth')
export class AuthController {
  private readonly logger: AppLogger;

  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {
    this.logger = new AppLogger(AuthController.name);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    this.logger.log(`POST /auth/register - Attempt to register user: ${email}`);
    const user = await this.registerUserUseCase.execute(username, email, password);
    this.logger.log(`User registered successfully: ${email}`);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    this.logger.log(`POST /auth/login - Attempt to login user: ${email}`);
    const result = await this.loginUserUseCase.execute(email, password);
    this.logger.log(`User logged in successfully: ${email}`);
    return {
      message: 'Login successful',
      ...result,
    };
  }
}
