import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/auth.grard';
import { HttpExceptionFilter } from './common/exception/http.exception.filter';
import { DatabaseConfiguration } from './config/typeorm.config';
import { PostsController } from './posts/controller/posts.controller';
import { PostsModule } from './posts/posts.module';
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
