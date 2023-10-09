import { HttpStatus } from '@nestjs/common';
import { ExceptionType } from 'src/common/exception';

export class AuthExceptionType implements ExceptionType {
  status: HttpStatus;

  exceptionCode: number;

  message: string;

  constructor(status: HttpStatus, exceptionCode: number, message: string) {
    this.status = status;
    this.exceptionCode = exceptionCode;
    this.message = message;
  }

  static BAD_REQUEST = new AuthExceptionType(
    HttpStatus.BAD_REQUEST,
    4000,
    '아이디 또는 패스워드를 입력해주세요',
  );
}
