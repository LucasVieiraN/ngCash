import { HttpException, Injectable } from '@nestjs/common';
import { prisma } from '../../database';
import {
  TransferTransactionDto,
  DebitedTransactionDto,
  TransactionsDto,
} from './dto/transaction.dto';
import { compareAsc, compareDesc } from 'date-fns';
import { Transactions } from '@prisma/client';

@Injectable()
export class TransactionsService {
  async deposit({
    accountId,
    valueDeposit,
  }: DebitedTransactionDto): Promise<void> {
    const searchedUser = await prisma.users.findFirst({
      where: { accountsId: accountId },
    });

    const accountsIdOfTheUserWhoWillDepositTheMoney = searchedUser.accountsId;

    const balanceUser = (
      await prisma.accounts.findFirst({
        where: { id: accountsIdOfTheUserWhoWillDepositTheMoney },
      })
    ).balance;

    if (Number(valueDeposit) <= 0) {
      throw new HttpException('Enter a positive value', 401);
    }

    await prisma.accounts.update({
      where: { id: accountsIdOfTheUserWhoWillDepositTheMoney },
      data: { balance: String(Number(valueDeposit) + Number(balanceUser)) },
    });

    await prisma.transactions.create({
      data: {
        value: valueDeposit,
        creditedAccountId: accountsIdOfTheUserWhoWillDepositTheMoney,
        debitedAccountId: accountsIdOfTheUserWhoWillDepositTheMoney,
      },
    });
  }

  async transfer({
    toWhoWillSend,
    valueTransfer,
    userId,
  }: TransferTransactionDto): Promise<void> {
    const userWhoWillReceiveMoney = await prisma.users.findFirst({
      where: { username: toWhoWillSend },
    });

    const accountIdOfTheUserWhoWillReceiveTheMoney =
      userWhoWillReceiveMoney.accountsId;

    const valueThatTheUserWillReceiveInTheAccount = (
      await prisma.accounts.findFirst({
        where: { id: accountIdOfTheUserWhoWillReceiveTheMoney },
      })
    ).balance;

    const userWhoSendingMoney = await prisma.users.findFirst({
      where: { id: userId },
    });

    const accountIdOfTheUserWhoWillTransferTheMoney =
      userWhoSendingMoney.accountsId;

    const valueThatTheUserWillTransferInTheAccount = (
      await prisma.accounts.findFirst({
        where: { id: accountIdOfTheUserWhoWillTransferTheMoney },
      })
    ).balance;

    if (
      accountIdOfTheUserWhoWillTransferTheMoney ===
      accountIdOfTheUserWhoWillReceiveTheMoney
    ) {
      throw new HttpException('Cannot send to yourself', 401);
    }

    if (
      Number(valueThatTheUserWillTransferInTheAccount) <= 0 ||
      Number(valueTransfer) <= 0
    ) {
      throw new HttpException('Insufficient funds', 401);
    }

    if (
      Number(valueTransfer) > Number(valueThatTheUserWillTransferInTheAccount)
    ) {
      throw new HttpException('Insufficient funds', 401);
    }

    await prisma.transactions.create({
      data: {
        value: valueTransfer,
        creditedAccountId: accountIdOfTheUserWhoWillReceiveTheMoney,
        debitedAccountId: accountIdOfTheUserWhoWillTransferTheMoney,
      },
    });

    await prisma.accounts.update({
      where: { id: accountIdOfTheUserWhoWillReceiveTheMoney },
      data: {
        balance: String(
          Number(valueTransfer) +
            Number(valueThatTheUserWillReceiveInTheAccount),
        ),
      },
    });

    await prisma.accounts.update({
      where: { id: accountIdOfTheUserWhoWillTransferTheMoney },
      data: {
        balance: String(
          Number(valueThatTheUserWillTransferInTheAccount) -
            Number(valueTransfer),
        ),
      },
    });
  }

  async transactions({ userId, orderBy }: TransactionsDto) {
    const userWhoSendingMoney = (
      await prisma.users.findFirst({
        where: { id: userId },
      })
    ).accountsId;

    const debitedMoneyTable = await prisma.transactions.findMany({
      where: { debitedAccountId: userWhoSendingMoney },
    });

    const creditMoneyTable = await prisma.transactions.findMany({
      where: { creditedAccountId: userWhoSendingMoney },
    });

    const newArrayCredit = creditMoneyTable.map((transaction) => {
      if (transaction.creditedAccountId === transaction.debitedAccountId) {
        return { ...transaction, creditedAccountId: null };
      }
      return transaction;
    });

    const newArrayDebit = debitedMoneyTable.map((transaction) => {
      if (transaction.creditedAccountId === transaction.debitedAccountId) {
        return { ...transaction, debitedAccountId: null };
      }
      return transaction;
    });

    const methodSort = {
      asc: compareAsc,
      desc: compareDesc,
    };

    function sortByMethod(transactions: Transactions[]) {
      return transactions.sort((a, b) =>
        methodSort[orderBy](a.createdAt, b.createdAt),
      );
    }

    const orderByDateCreditArray = sortByMethod(newArrayCredit);
    const orderByDateDebitArray = sortByMethod(newArrayDebit);

    const allTable = [orderByDateDebitArray, orderByDateCreditArray];

    return allTable;
  }
}
