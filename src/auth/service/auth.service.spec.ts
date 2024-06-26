import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        ConfigService,
      ],
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
      const fakeUser = {
        email: 'test@example.com',
        password: await bcrypt.hash('testpassword', 10),
      };
      mockUserService.findOneByEmail.mockResolvedValue(new User(fakeUser.email, fakeUser.password));
      mockJwtService.signAsync
        .mockReturnValueOnce('accessToken') // createAccessToken 호출 시 반환 값
        .mockReturnValueOnce('refreshToken'); // createRefreshToken 호출 시 반환 값

      // When
      const accessToken = await service.signIn(signInRequest);

      // Then
      expect(accessToken).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });

    it('회원이 없을시 에러', async () => {
      // Given
      const expectedError = new AuthException(AuthExceptionType.NOT_FOUND_USER);
      mockUserService.findOneByEmail.mockRejectedValue(expectedError);

      // When

      // then
      expect(service.signIn(signInRequest)).rejects.toThrow(expectedError);
    });

    it('패스워드 틀릴시 에러', async () => {
      // Given
      const exception = new AuthException(AuthExceptionType.INVALID_CREDENTIALS);
      const fakeUser = {
        email: 'test@example.com',
        password: await bcrypt.hash('fakepassword', 10),
      };
      mockUserService.findOneByEmail.mockResolvedValue(
        new User(fakeUser.email, signInRequest.password),
      );

      // When
      expect(service.signIn(fakeUser)).rejects.toThrow(exception);
    });
  });
});
