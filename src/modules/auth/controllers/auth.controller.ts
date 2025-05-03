import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterUserUseCase } from '../use-cases/register_user.use_case';
import { LoginUserUseCase } from '../use-cases/login_user.use_case';
import { AuthDto } from '../dto/auth.dto';
import { Public } from '../../../shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    const { username, email, password } = authDto;

    try {
      const user = await this.registerUserUseCase.execute(username, email, password);
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { email, password } = authDto;

    try {
      const result = await this.loginUserUseCase.execute(email, password);
      return {
        message: 'Login successful',
        ...result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
