import { Roles } from '@/auth/decorators/roles.decorators';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserEntity } from '@/user/entities/user.entity';
import { UserTypeEnum } from '@/user/enums/user-type.enum';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All users', type: UserEntity, isArray: true })
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  /**
   * Get current user
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Current user', type: UserEntity })
  @Get('me')
  getAuthenticatedUser(@Req() req: Request) {
    return req.user;
  }

  /**
   * Update current user
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updated user', type: UserEntity })
  @Patch('me')
  updateAuthenticatedUser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  /**
   * Get all patients [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All patients', type: UserEntity })
  @Get('patients')
  async getAllPatients() {
    return this.userService.findAll(UserTypeEnum.PATIENT);
  }

  /**
   * Create patient [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post('patients')
  async createPatient(@Body() createUserDto: CreateUserDto) {
    return this.userService.excludePassword(
      await this.userService.createDoctor(createUserDto),
    );
  }

  /**
   * Get all doctors
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All doctors', type: UserEntity })
  @Get('doctors')
  async getAllDoctors() {
    return this.userService.findAll(UserTypeEnum.DOCTOR);
  }

  /**
   * Create doctor [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created doctor', type: UserEntity })
  @Post('doctors')
  async createDoctor(@Body() createUserDto: CreateUserDto) {
    return this.userService.excludePassword(
      await this.userService.createDoctor(createUserDto),
    );
  }

  /**
   * Get user by id [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.userService.excludePassword(await this.userService.findOne(id));
  }

  /**
   * Update user [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updated user', type: UserEntity })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Delete user [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
