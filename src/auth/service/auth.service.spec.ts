import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { AuthException, AuthExceptionType } from '../exception';

import { AuthService } from './auth.service';
import { SignInRequest } from './dto';

const mockUserService = {
  findOneByEmail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UserService, useValue: mockUserService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('hashedPassword()', () => {
    it('해시화된 비밀번호를 만든다', async () => {
      // Given
      const password = 'testpassword';

      // When
      const hashedPassword = await service.hashPassword(password);

      // Then
      expect(bcrypt.compareSync(password, hashedPassword)).toBe(true);
    });
  });

  describe('signIn()', () => {
    let signInRequest: SignInRequest;
    beforeEach(() => {
      signInRequest = {
        email: 'test@example.com',
        password: 'testpassword',
      };
    });
    it('로그인 성공', async () => {
      // Given
      mockUserService.findOneByEmail.mockResolvedValue(
        new User(signInRequest.email, signInRequest.password),
      );

      // When
      const accessToken = await service.signIn(signInRequest);

      // Then
      expect(accessToken).toEqual(expect.any(String));
    });

    it('회원이 없을시 에러', async () => {
      // Given
      const expectedError = new AuthException(AuthExceptionType.NOT_FOUND_USER);
      mockUserService.findOneByEmail.mockRejectedValue(expectedError);

      // When

      // then
      expect(service.signIn(signInRequest)).rejects.toThrow(expectedError);
    });
  });
});
