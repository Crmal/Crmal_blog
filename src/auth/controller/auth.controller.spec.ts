import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('회원가입한 데이터 반환', async () => {
    const userData = { email: 'test@example.com', password: 'testpassword' };

    const result = await controller.signUp(userData);

    expect(result).toBeDefined();
  });
});
