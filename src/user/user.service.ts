import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, map } from 'rxjs';
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
    private userFactory: UserFactory,
    private authService: AuthService,
  ) {}

  create(signUpRequestDto: SignUpRequestDto): Observable<Omit<User, 'password'>> {
    this.checkUserAndThrowError(signUpRequestDto.email);

    return this.authService.hashPassword(signUpRequestDto.password).pipe(
      map(hashedPassword => {
        const user = this.userFactory.createUser(signUpRequestDto.email, hashedPassword);
        const { password, ...result } = user;
        this.userRepository.save(user);
        return result as Omit<User, 'password'>;
      }),
    );
  }

  checkUserAndThrowError(email: string): void {
    const user = this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new AuthException(AuthExceptionType.CONFLICT_DUPLICATE_USER);
    }
  }
}
