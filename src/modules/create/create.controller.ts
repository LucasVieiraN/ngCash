import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateService } from './create.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('signIn')
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const { id, username, accountsId } = await this.createService.create(
      createUserDto,
    );

    return { id, username, accountsId };
  }
}
