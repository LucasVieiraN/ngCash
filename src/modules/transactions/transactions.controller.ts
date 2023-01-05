import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  HttpException,
  Get,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  DebitedTransactionDto,
  TransferTransactionDto,
  TransactionsDto,
} from './dto/transaction.dto';
import { Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/deposit')
  @HttpCode(204)
  async deposit(@Body() { accountId, valueDeposit }: DebitedTransactionDto) {
    try {
      return this.transactionsService.deposit({ accountId, valueDeposit });
    } catch {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Post('/transfer')
  @HttpCode(204)
  async transfer(
    @Body() { toWhoWillSend, valueTransfer }: TransferTransactionDto,
    @Req() req: Request,
  ) {
    try {
      const userId = req.user_id;

      return this.transactionsService.transfer({
        toWhoWillSend,
        valueTransfer,
        userId,
      });
    } catch {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get()
  @HttpCode(200)
  async transactions(
    @Body() { accountId }: TransactionsDto,
    @Req() req: Request,
  ) {
    try {
      const userId = req.user_id;

      const orderBy = req.query.order as 'asc' | 'desc';

      return this.transactionsService.transactions({
        userId,
        accountId,
        orderBy: orderBy || 'desc',
      });
    } catch {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
