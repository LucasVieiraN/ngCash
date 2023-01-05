import { HttpException, Injectable } from '@nestjs/common';
import { Accounts } from '@prisma/client';

import { prisma } from '../../database';

@Injectable()
export class AccountsService {
  async findAccount(userId: string): Promise<Accounts> {
    const foundUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }

    const accountId = foundUser.accountsId;

    const foundAccount = await prisma.accounts.findUnique({
      where: { id: accountId },
    });

    if (!foundAccount) {
      throw new HttpException('Account not found', 404);
    }

    return foundAccount;
  }
}
