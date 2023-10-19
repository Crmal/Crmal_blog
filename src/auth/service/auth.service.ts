import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  hashPassword(password: string): Observable<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return of(hashedPassword);
  }
}
