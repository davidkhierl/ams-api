import { AppointMentStatusEnum } from '@/appointment/enums/appointment-status.enum';
import { Appointment } from '@prisma/client';

export class AppointmentEntity implements Appointment {
  /**
   * Appointment id
   */
  id: string;

  /**
   * Patient id
   */
  patient_id: string;

  /**
   * Doctor id
   */
  doctor_id: string;

  /**
   * Appointment start date
   */
  start_date: Date;

  /**
   * Appointment end date
   */
  end_date: Date;

  /**
   * Appointment status
   */
  status: AppointMentStatusEnum;

  /**
   * Appointment created date
   */
  created_at: Date;

  /**
   * Appointment updated date
   */
  updated_at: Date;
}
