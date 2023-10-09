import { HttpStatus } from '@nestjs/common';

export interface ExceptionType {
  status: HttpStatus;

  exceptionCode: number;

  message: string;
}
