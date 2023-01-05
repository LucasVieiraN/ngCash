import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateUserController } from './authenticate-user.controller';

describe('AuthenticateUserController', () => {
  let controller: AuthenticateUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateUserController],
    }).compile();

    controller = module.get<AuthenticateUserController>(
      AuthenticateUserController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
