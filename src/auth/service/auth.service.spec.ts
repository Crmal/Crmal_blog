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
});
