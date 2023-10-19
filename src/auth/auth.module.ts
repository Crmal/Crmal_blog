import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserFactory } from 'src/user/factories/user.factory';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, UserService, UserFactory],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
