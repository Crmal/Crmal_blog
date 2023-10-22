import { HttpException } from '@nestjs/common';

import { ExceptionType } from './exception.type';

export class BaseException extends HttpException {
  constructor(exceptionType: ExceptionType) {
    super(exceptionType.message, exceptionType.status);
    this.statusCode = exceptionType.exceptionCode;
    this.timestamp = exceptionType.timestamp;
  }

  statusCode: number;

  timestamp: Date;

  path: string;
}
