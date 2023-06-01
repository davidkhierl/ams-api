import { AppointmentService } from '@/appointment/appointment.service';
import { CreateAppointmentDto } from '@/appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '@/appointment/dto/update-appointment.dto';
import { AppointmentEntity } from '@/appointment/entities/appointment.entity';
import { Roles } from '@/auth/decorators/roles.decorators';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Create appointment [PATIENT, ADMIN]
   */
  @Roles(Role.PATIENT, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Created appointment',
    type: AppointmentEntity,
  })
  @Post()
  create(
    @Req() req: Request,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    switch (req.user.type) {
      case 'PATIENT':
        return this.appointmentService.create({
          ...createAppointmentDto,
          patient_id: req.user.id,
        });

      case 'DOCTOR':
        return this.appointmentService.create(createAppointmentDto);

      default:
        throw new HttpException(
          'Method not allowed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
    }
  }

  /**
   * Get all appointments related to current user.
   * While ADMIN can access all records.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get all appointments related to current user.',
    type: AppointmentEntity,
    isArray: true,
  })
  findAll(@Req() req: Request) {
    switch (req.user.type) {
      case 'PATIENT':
        return this.appointmentService.findAllByPatientId(req.user.id);

      case 'DOCTOR':
        return this.appointmentService.findAllByDoctorId(req.user.id);

      case 'ADMIN':
        return this.appointmentService.findAll();

      default:
        throw new HttpException(
          'Method not allowed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
    }
  }

  /**
   * Get appointment related to current user.
   * While ADMIN can access all records.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Appointment', type: AppointmentEntity })
  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    switch (req.user.type) {
      case 'PATIENT':
        return this.appointmentService.findOneByPatientId(id, req.user.id);

      case 'DOCTOR':
        return this.appointmentService.findOneByDoctorId(id, req.user.id);

      case 'ADMIN':
        return this.appointmentService.findOne(id);

      default:
        throw new HttpException(
          'Method not allowed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
    }
  }

  /**
   * Update appointment [DOCTOR, ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updated appointment',
    type: AppointmentEntity,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  /**
   * Delete appointment [ADMIN]
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deleted appointment',
    type: AppointmentEntity,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
