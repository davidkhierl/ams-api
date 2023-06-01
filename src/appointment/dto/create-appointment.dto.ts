import { AppointmentEntity } from '@/appointment/entities/appointment.entity';
import { AppointMentStatusEnum } from '@/appointment/enums/appointment-status.enum';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateAppointmentDto extends PickType(AppointmentEntity, [
  'patient_id',
  'doctor_id',
  'start_date',
  'end_date',
  'status',
]) {
  @IsMongoId()
  @IsNotEmpty()
  patient_id: string;

  @IsMongoId()
  @IsNotEmpty()
  doctor_id: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  end_date: Date;

  /**
   * Appointment status
   *
   * @example "APPROVED"
   */
  @IsOptional()
  @IsEnum(AppointMentStatusEnum)
  status: AppointMentStatusEnum = AppointMentStatusEnum.APPROVED;
}
