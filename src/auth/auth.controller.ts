import { AuthService } from '@/auth/auth.service';
import { AuthResponseDto } from '@/auth/dto/auth-response.dto';
import { AuthSignUpDto } from '@/auth/dto/auth-signup.dto';
import { AuthDto } from '@/auth/dto/auth.dto';
import { JwtRefreshAuthGuard } from '@/auth/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login user
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: AuthDto,
  })
  @Post('login')
  async login(@User() user: UserEntity): Promise<AuthResponseDto> {
    const tokens = await this.authService.generateToken(user.id, user.email);

    return tokens;
  }

  /**
   * Get new access token
   */
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@User() user: UserEntity): Promise<AuthResponseDto> {
    const tokens = await this.authService.generateToken(user.id, user.email);

    return tokens;
  }

  /**
   * Register user patient
   */
  @Post('patient/signup')
  async signup(@Body() authSignUpDto: AuthSignUpDto): Promise<AuthResponseDto> {
    const user = await this.authService.registerPatientUser(authSignUpDto);

    return this.authService.generateToken(user.id, user.email);
  }
}
