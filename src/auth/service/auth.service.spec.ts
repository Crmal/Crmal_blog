import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
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
