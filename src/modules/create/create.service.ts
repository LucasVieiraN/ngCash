import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

import { CreateUserDto } from './dto/create-user.dto';
import { prisma } from '../../database';
import { hashPassword } from '../../utils/hash';
import { isValidPassword } from '../../utils/validate-password';
import { Users } from '@prisma/client';

@Injectable()
export class CreateService {
  async create({ username, password }: CreateUserDto): Promise<Users> {
    if (username.length <= 3) {
      throw new HttpException(
        'The username must contain at least 3 letters',
        400,
      );
    }

    if (!isValidPassword(password)) {
      throw new HttpException(
        'Password must contain 1 number, 1 uppercase and at least 8 characters',
        400,
      );
    }

    const userExisting = await prisma.users.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });

    if (userExisting) {
      throw new HttpException('User already exists', 401);
    }

    const account = await prisma.accounts.create({
      data: { balance: '100.00' },
    });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        accountsId: account.id,
      },
    });

    return user;
  }
}
