import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
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

  it('해시화된 비밀번호를 만든다', async () => {
    // Given
    const password = 'testpassword';

    // When
    const hashedPassword = await service.hashPassword(password);

    // Then
    expect(bcrypt.compareSync(password, hashedPassword)).toBe(true);
  });

  // it('회원이 있을경우 토큰을 발급하여 준다.', async () => {
  //   // Given
  //   const user = new SignInRequest();
  //   user.email = 'test@example.com';
  //   user.password = 'testpassword';

  //   // When
  //   const token = await service.signIn(user);

  //   // Then
  //   expect(token).toBeDefined();
  // });

  // it('회원이 없을경우 에러를 던진다', async () => {
  //   // Given
  //   const user = new SignInRequest();
  //   user.email = 'test@example.com';
  //   user.password = 'testpassword';
  //   const expectedError = new AuthException(AuthExceptionType.NOT_FOUND_USER);

  //   expect(service.signIn(user)).rejects.toThrow(expectedError);
  // });
});
