import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { HttpExceptionFilter } from 'src/common/exception/http.exception.filter';

import { User } from './entity/user.entity';
import { UserFactory } from './factories/user.factory';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserFactory,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
