import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  }
}
