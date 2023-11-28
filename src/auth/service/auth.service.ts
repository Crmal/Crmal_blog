import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { AuthException, AuthExceptionType } from '../exception';

import { SignInRequest } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  }

  async signIn(signInRequest: SignInRequest): Promise<string> {
    const user = await this.validateUser(signInRequest);
    const accessToken = this.createAccessToken(user.id);
    return accessToken;
  }

  async createAccessToken(userId: number): Promise<string> {
    const payload = { userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async validateUser(signInRequest: SignInRequest): Promise<User> {
    const exception = new AuthException(AuthExceptionType.INVALID_CREDENTIALS);
    const user = await this.userService.findOneByEmail(signInRequest.email);
    if (!(await bcrypt.compare(signInRequest.password, user.password))) {
      throw exception;
    }
    return user;
  }
}
