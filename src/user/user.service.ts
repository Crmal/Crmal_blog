import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthException, AuthExceptionType } from 'src/auth/exception';
import { AuthService } from 'src/auth/service/auth.service';
import { SignUpRequestDto } from 'src/auth/service/dto';
import { Repository } from 'typeorm';

import { User } from './entity/user.entity';
import { UserFactory } from './factories/user.factory';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    private userFactory: UserFactory,
  ) {}

  async create(signUpRequestDto: SignUpRequestDto): Promise<Omit<User, 'password'>> {
    await this.checkUserAndThrowError(signUpRequestDto.email);

    const hashedPassword = await this.authService.hashPassword(signUpRequestDto.password);
    const user = this.userFactory.createUser(signUpRequestDto.email, hashedPassword);
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async checkUserAndThrowError(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AuthException(AuthExceptionType.NOT_FOUND_USER);
    }

    return user;
  }
}
