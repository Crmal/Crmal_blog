import { BaseException, ExceptionType } from 'src/common/exception';

export class PostException extends BaseException {
  constructor(exceptionType: ExceptionType) {
    super(exceptionType);
  }
}
