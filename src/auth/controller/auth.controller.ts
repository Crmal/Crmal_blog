import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { SignUpRequestDto } from '../service/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<User> {
    const userData = await this.userService.signUp(signUpRequestDto);
    return userData;
  }
}
