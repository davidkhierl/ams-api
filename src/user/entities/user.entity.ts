import { UserTypeEnum } from '@/user/enums/user-type.enum';
import { User } from '@prisma/client';

export class UserEntity implements Omit<User, 'password_hash'> {
  /**
   * User ID
   */
  id: string;

  /**
   * User email
   */
  email: string;

  /**
   * User name
   */
  name: string;

  /**
   * User type
   */
  type: UserTypeEnum;

  /**
   * User created date
   */
  created_at: Date;

  /**
   * User updated date
   */
  updated_at: Date;
}
