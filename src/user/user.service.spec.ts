import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthException, AuthExceptionType } from 'src/auth/exception';
import { AuthService } from 'src/auth/service/auth.service';
import { SignUpRequestDto } from 'src/auth/service/dto';
import { Repository } from 'typeorm';

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
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: UserFactory, useValue: mockUserFactory },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userFactory = module.get<UserFactory>(UserFactory);
  });
  describe('create()', () => {
    it('유저 생성', async () => {
      // given
      const user = new SignUpRequestDto();
      user.email = 'test@example.com';
      user.password = 'testpassword';
      mockUserFactory.createUser.mockReturnValue(new User(user.email, user.password));
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue('hashPassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(new User(user.email, user.password));

      // When
      const result = await userService.create(user);

      // Then
      expect(result).toHaveProperty('email', user.email);
    });

    it('이미 있는 계정 에러', async () => {
      // given
      const user = { email: 'test@example.com', password: 'testpassword' };
      const expectedError = new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User(user.email, user.password));
      // then
      expect(userService.checkUserAndThrowError(user.email)).rejects.toThrow(expectedError);
    });
  });
});
