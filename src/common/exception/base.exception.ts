import { HttpException } from '@nestjs/common';

import { ExceptionType } from './exception.type';

export class BaseException extends HttpException {
  private exceptionType: ExceptionType;

  constructor(exceptionType: ExceptionType) {
    super(exceptionType.message, exceptionType.status);
    this.exceptionType = exceptionType;
  }

  getExceptionType(): ExceptionType {
    return this.exceptionType;
  }
}
