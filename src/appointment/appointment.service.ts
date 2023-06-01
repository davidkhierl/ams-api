import { CreateAppointmentDto } from '@/appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '@/appointment/dto/update-appointment.dto';
import { BadUserInputException } from '@/common/exceptions/bad-user-input.exception';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Appointment, User } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    // convert date to dayjs instance
    const startDateDayjs = dayjs(createAppointmentDto.start_date);
    const endDateDayjs = dayjs(createAppointmentDto.end_date);

    // transform date
    const start_date = this._transformDate(startDateDayjs).format();
    const end_date = this._transformDate(endDateDayjs).format();

    // check wether the doctor already have appointment for this time slot
    const existingAppointment = await this.prismaService.appointment.findFirst({
      where: {
        AND: [
          { doctor_id: createAppointmentDto.doctor_id },
          { start_date: start_date },
        ],
      },
    });

    if (existingAppointment)
      throw new BadUserInputException([
        {
          property: 'start_date',
          value: createAppointmentDto.start_date,
          constraints: {
            timeSlotNotAvailable: 'Time slot is not available',
          },
        },
      ]);

    return this._excludePasswords(
      await this.prismaService.appointment.create({
        data: {
          ...createAppointmentDto,
          start_date,
          end_date,
        },
        include: { doctor: true, patient: true },
      }),
    );
  }

  async findAll() {
    const appointments = await this.prismaService.appointment.findMany({
      include: { doctor: true, patient: true },
    });

    return appointments.map((appointment) =>
      this._excludePasswords(appointment),
    );
  }

  async findOne(id: string) {
    return this._excludePasswords(
      await this.prismaService.appointment.findUniqueOrThrow({
        where: { id },
        include: { doctor: true, patient: true },
      }),
    );
  }

  async findAllByPatientId(patient_id: string) {
    const appointments = await this.prismaService.appointment.findMany({
      where: { patient_id },
      include: { doctor: true, patient: true },
    });
    return appointments.map((appointment) =>
      this._excludePasswords(appointment),
    );
  }

  async findOneByPatientId(id: string, patientId: string) {
    return this._excludePasswords(
      await this.prismaService.appointment.findFirstOrThrow({
        where: { AND: [{ id, patient_id: patientId }] },
        include: { doctor: true, patient: true },
      }),
    );
  }

  async findAllByDoctorId(doctor_id: string) {
    const appointments = await this.prismaService.appointment.findMany({
      where: { doctor_id },
      include: { doctor: true, patient: true },
    });
    return appointments.map((appointment) =>
      this._excludePasswords(appointment),
    );
  }

  async findOneByDoctorId(id: string, doctorId: string) {
    return this._excludePasswords(
      await this.prismaService.appointment.findFirstOrThrow({
        where: { AND: [{ id, doctor_id: doctorId }] },
        include: { doctor: true, patient: true },
      }),
    );
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this._excludePasswords(
      await this.prismaService.appointment.update({
        where: { id },
        data: updateAppointmentDto,
      }),
    );
  }

  async remove(id: string) {
    return this._excludePasswords(
      await this.prismaService.appointment.delete({ where: { id } }),
    );
  }

  private _excludePasswords(appointment: any): Appointment & {
    doctor: Omit<User, 'password_hash'>;
    patient: Omit<User, 'password_hash'>;
  } {
    delete appointment.patient.password_hash;
    delete appointment.doctor.password_hash;
    return appointment;
  }

  private _transformDate(date: dayjs.Dayjs) {
    return date.set('m', 0).set('s', 0).set('millisecond', 0);
  }
}
