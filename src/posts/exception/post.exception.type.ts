import { HttpStatus } from '@nestjs/common';
import { ExceptionType } from 'src/common/exception';

export class PostExceptionType implements ExceptionType {
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

  static NOT_FOUND_POST: PostExceptionType = new PostExceptionType(
    HttpStatus.NOT_FOUND,
    new Date(),
    4040,
    '해당 포스트가 존재하지 않습니다.',
  );
}
