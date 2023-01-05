import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { compare } from 'bcrypt';
import { generateToken } from 'src/utils/generate-token';

import { prisma } from '../../database';
import { CreateUserDto } from '../create/dto/create-user.dto';

@Injectable()
export class AuthenticateUserService {
  async authUser({ username, password }: CreateUserDto): Promise<{
    user: {
      id: string;
      username: string;
      accountId: string;
    };
    token: string;
  }> {
    const user = await prisma.users.findUnique({ where: { username } });

    if (!user) {
      throw new HttpException('Email or password incorrect', 406);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Email or password incorrect', 406);
    }

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        accountId: user.accountsId,
      },
      token,
    };
  }
}
