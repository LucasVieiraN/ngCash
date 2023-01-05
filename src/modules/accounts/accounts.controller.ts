import { Controller, Req, Post } from '@nestjs/common';
import { Request } from 'express';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  findAccount(@Req() request: Request) {
    const user = request.user_id;

    return this.accountsService.findAccount(user);
  }
}
