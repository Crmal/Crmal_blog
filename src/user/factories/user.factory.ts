import { User } from '../entity/user.entity';

export class UserFactory {
  createUser(email: string, password: string) {
    const user = new User(email, password);
    return user;
  }
}
