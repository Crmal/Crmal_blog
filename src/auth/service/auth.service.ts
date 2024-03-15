import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  }

  async signIn(signInRequest: SignInRequest): Promise<Record<string, string>> {
    const user = await this.validateUser(signInRequest);
    const accessToken = await this.createAccessToken(user.id);
    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async createAccessToken(userId: number): Promise<string> {
    const payload = { userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
    });
    return accessToken;
  }

  async createRefreshToken(userId: number): Promise<string> {
    const payload = { userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
    });
    return refreshToken;
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
