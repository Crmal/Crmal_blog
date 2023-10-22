import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';

import { AuthException, AuthExceptionType } from '../exception';
import { AuthService } from '../service/auth.service';
import { SignUpRequestDto } from '../service/dto';

import { AuthController } from './auth.controller';

/** UserService Mocking */
const mockUserService = {
  checkUserAndThrowError: jest.fn(),
  create: jest.fn(),
};
/** AuthService Mocking */
const mockAuthService = {
  hashPassword: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  describe('회원가입 기능', () => {
    const signUpRequestDto: SignUpRequestDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    it('회원가입에 성공할시 패스워드를 제외한 유저 정보를 응답한다.', async () => {
      const createdUser = { id: 1, email: 'test@example.com' };

      mockUserService.create.mockReturnValue(createdUser);

      const result = await controller.signUp(signUpRequestDto);
      expect(result).toEqual(createdUser);
    });

    it('이미 존재하는 계정일 경우 에러를 던진다.', async () => {
      mockUserService.checkUserAndThrowError.mockRejectedValue(
        new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER),
      );
      try {
        await controller.signUp(signUpRequestDto);
        throw new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER);
      } catch (error) {
        expect(error.response).toEqual('이미 존재하는 유저입니다.');
        expect(error.status).toEqual(409);
        expect(error.statusCode).toEqual(4090);
        expect(error.timestamp).toEqual(expect.any(Date));
      }
    });
  });
});
