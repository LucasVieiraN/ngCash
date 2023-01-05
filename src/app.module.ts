import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnsureAuthenticateMiddleware } from './middleware/ensure-authenticate.middleware';
import { CreateModule } from './modules/create/create.module';
import { AuthenticateModule } from './modules/authenticate-user/authenticate.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AccountsController } from './modules/accounts/accounts.controller';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TransactionsController } from './modules/transactions/transactions.controller';

@Module({
  imports: [
    CreateModule,
    AuthenticateModule,
    AccountsModule,
    TransactionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticateMiddleware)
      .forRoutes(AccountsController, TransactionsController);
  }
}
