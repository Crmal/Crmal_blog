import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './guard/jwt.startegy';
import { AuthService } from './service/auth.service';
import { UserService } from 'src/user/user.service';
import { UserFactory } from 'src/user/factories/user.factory';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
        signOptions: {
          expiresIn: 3600 * 24,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UserService, UserFactory, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
