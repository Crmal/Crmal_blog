// database.configuration.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = this.configService.get('LAUNCH_ENV') === 'prod';
    const host = isProduction ? 'mysql' : 'mysql-test';

    const commonOptions: TypeOrmModuleOptions = {
      type: 'mysql',
      host,
      port: parseInt(this.configService.get('DB_PORT'), 10) || 3306,
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      autoLoadEntities: true,
      synchronize: true,
    };

    if (this.configService.get('LAUNCH_ENV') === 'local') {
      return {
        ...commonOptions,
        host: 'localhost', // 또는 원하는 로컬 호스트 주소
      };
    }

    return commonOptions;
  }
}
