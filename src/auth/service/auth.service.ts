import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

import { SignInRequest } from './dto';

@Injectable()
export class AuthService {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  }

  async signIn(signInRequest: SignInRequest): Promise<string> {
    const user = await this.userService.findOneByEmail(signInRequest.email);
    return 'token';
  }
}
