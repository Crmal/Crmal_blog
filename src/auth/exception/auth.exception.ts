import { BaseException, ExceptionType } from 'src/common/exception';

export class AuthException extends BaseException {
  constructor(exceptionType: ExceptionType) {
    super(exceptionType);
  }
}
