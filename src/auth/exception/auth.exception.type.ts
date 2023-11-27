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

  static INVALID_CREDENTIALS: AuthExceptionType = new AuthExceptionType(
    HttpStatus.UNAUTHORIZED,
    new Date(),
    4010,
    '아이디 또는 패스워드가 잘못되었습니다.',
  );

  static NOT_FOUND_USER: AuthExceptionType = new AuthExceptionType(
    HttpStatus.NOT_FOUND,
    new Date(),
    4040,
    '등록된 회원이 아닙니다.',
  );
}
