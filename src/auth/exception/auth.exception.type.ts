import { HttpStatus } from '@nestjs/common';
import { ExceptionType } from 'src/common/exception';

export class AuthExceptionType implements ExceptionType {
  constructor(status: HttpStatus, timestamp: Date, exceptionCode: number, message: string) {
    this.status = status;
    this.timestamp = timestamp;
    this.exceptionCode = exceptionCode;
    this.message = message;
  }

  status: HttpStatus;

  timestamp: Date;

  exceptionCode: number;

  message: string;

  static CONFLICT_DUPLICATE_USER: AuthExceptionType = new AuthExceptionType(
    HttpStatus.CONFLICT,
    new Date(),
    4090,
    '이미 존재하는 유저입니다.',
  );
}
