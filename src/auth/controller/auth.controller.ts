import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { AuthService } from '../service/auth.service';
import { SignInRequest, SignUpRequestDto } from '../service/dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('')
  @HttpCode(201)
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<Omit<User, 'password'>> {
    return await this.userService.create(signUpRequestDto);
  }

  @Post('signin')
  @HttpCode(201)
  async signin(@Body() signInRequest: SignInRequest): Promise<string> {
    return await this.authService.signIn(signInRequest);
  }
}
