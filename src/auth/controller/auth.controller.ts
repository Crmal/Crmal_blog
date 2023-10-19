import { Body, Controller, HttpCode, Post, UseFilters } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpExceptionFilter } from 'src/common/exception/http.exception.filter';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { SignUpRequestDto } from '../service/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(201)
  signUp(@Body() signUpRequestDto: SignUpRequestDto): Observable<Omit<User, 'password'>> {
    return this.userService.create(signUpRequestDto);
  }
}
