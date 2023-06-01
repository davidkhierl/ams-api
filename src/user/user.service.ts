import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserTypeEnum } from '@/user/enums/user-type.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createPatient({
    password,
    ...rest
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const password_hash = await argon2.hash(password);
    return this.prisma.user.create({
      data: { password_hash, ...rest, type: 'PATIENT' },
    });
  }

  async createDoctor({
    password,
    ...rest
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const password_hash = await argon2.hash(password);
    return this.prisma.user.create({
      data: { password_hash, ...rest, type: 'DOCTOR' },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(type?: UserTypeEnum) {
    const users = await this.prisma.user.findMany({ where: { type } });

    return users.map((user) => this.excludePassword(user));
  }

  async update(id: string, data: UpdateUserDto) {
    return this.excludePassword(
      await this.prisma.user.update({ where: { id }, data }),
    );
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (user && user.type === 'ADMIN')
      throw new HttpException(
        'Method not allowed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    return this.excludePassword(
      await this.prisma.user.delete({ where: { id } }),
    );
  }

  excludePassword(user: User): Omit<User, 'password_hash'> {
    delete user.password_hash;

    return user;
  }
}
