import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshDto {
  /**
   * Refresh token
   */
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
