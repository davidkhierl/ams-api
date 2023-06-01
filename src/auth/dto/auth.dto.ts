import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  /**
   * Login email
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Login password
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
