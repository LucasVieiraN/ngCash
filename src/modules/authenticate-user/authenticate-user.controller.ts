import { Controller, Post, HttpCode, Body } from '@nestjs/common';

import { CreateUserDto } from '../create/dto/create-user.dto';
import { AuthenticateUserService } from './authenticate-user.service';

@Controller('auth')
export class AuthenticateUserController {
  constructor(private readonly authenticateUser: AuthenticateUserService) {}

  @Post('signUp')
  @HttpCode(201)
  create(@Body() { username, password }: CreateUserDto) {
    return this.authenticateUser.authUser({ username, password });
  }
}
