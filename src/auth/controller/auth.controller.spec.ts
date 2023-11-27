import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';

import { AuthException, AuthExceptionType } from '../exception';
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
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  describe('회원가입 기능', () => {
    const signUpRequestDto: SignUpRequestDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    it('회원가입에 성공할시 패스워드를 제외한 유저 정보를 응답한다.', async () => {
      // Given
      const createdUser = { id: 1, email: 'test@example.com' };
      mockUserService.create.mockReturnValue(createdUser);

      // When
      const result = await controller.signUp(signUpRequestDto);

      // Then
      expect(result).toEqual(createdUser);
    });

    it('이미 존재하는 계정일 경우 에러를 던진다.', async () => {
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
