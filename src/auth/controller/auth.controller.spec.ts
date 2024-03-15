import { JwtModule, JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';

import { AuthException, AuthExceptionType } from '../exception';
import { AuthService } from '../service/auth.service';
import { SignUpRequestDto } from '../service/dto';

import { AuthController } from './auth.controller';

/** UserService Mocking */
const mockUserService = {
  create: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, { provide: UserService, useValue: mockUserService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  describe('회원가입 라우터', () => {
    const signUpRequestDto: SignUpRequestDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    it('회원가입시 패스워드를 제외한 유저 정보를 응답', async () => {
      // Given
      const createdUser = { id: 1, email: 'test@example.com' };
      mockUserService.create.mockReturnValue(createdUser);

      // When
      const result = await controller.signUp(signUpRequestDto);

      // Then
      expect(result).toEqual(createdUser);
    });

    it('존재하는 계정일 경우 에러', async () => {
      // Given
      const expectedError = new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER);
      mockUserService.create.mockRejectedValue(expectedError);

      // When
      const signUpPromise = controller.signUp(signUpRequestDto);

      // Then
      await expect(signUpPromise).rejects.toThrow(expectedError);
    });
  });
});
