import { HttpStatus } from '@nestjs/common';

export interface ExceptionType {
  status: HttpStatus;

  timestamp: Date;

  exceptionCode: number;

  message: string;
}
