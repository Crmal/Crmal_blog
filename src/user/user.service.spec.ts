import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthException, AuthExceptionType } from 'src/auth/exception';
import { AuthService } from 'src/auth/service/auth.service';
import { SignUpRequestDto } from 'src/auth/service/dto';

import { User } from './entity/user.entity';
import { UserFactory } from './factories/user.factory';
import { UserService } from './user.service';

const mockAuthService = {
  hashPassword: jest.fn(),
};

const mockUserFactory = {
  createUser: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserFactory, useValue: mockUserFactory },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('회원가입 성공시 패스워드를 제외한 User를 응답한다.', async () => {
    // given
    const user = new SignUpRequestDto();
    user.email = 'test@example.com';
    user.password = 'testpassword';
    mockUserFactory.createUser.mockReturnValue(new User(user.email, user.password));

    // When
    const result = await service.create(user);

    // Then
    expect(result).toHaveProperty('email', user.email);
  });

  it('회원 정보가 있을시 에러를 던진다.', async () => {
    // given
    const user = { email: 'test@example.com', password: 'testpassword' };
    const expectedError = new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER);

    mockUserRepository.findOne.mockReturnValue(new User(user.email, user.password));
    // then
    expect(service.checkUserAndThrowError(user.email)).rejects.toThrow(expectedError);
  });
});
