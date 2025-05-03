import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
