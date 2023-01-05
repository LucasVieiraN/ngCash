import { Module } from '@nestjs/common';
import { AuthenticateUserService } from './authenticate-user.service';
import { AuthenticateUserController } from './authenticate-user.controller';

@Module({
  controllers: [AuthenticateUserController],
  providers: [AuthenticateUserService],
})
export class AuthenticateModule {}
