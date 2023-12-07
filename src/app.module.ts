import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/exception/http.exception.filter';
import { DatabaseConfiguration } from './config/typeorm.config';
import { UserModule } from './user/user.module';

const businessModules = [AuthModule, UserModule];

const libModules = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({ useClass: DatabaseConfiguration }),
];

@Module({
  imports: [...businessModules, ...libModules],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
