import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { SignUpRequestDto } from '../service/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(201)
  signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<Omit<User, 'password'>> {
    return this.userService.create(signUpRequestDto);
  }
}
