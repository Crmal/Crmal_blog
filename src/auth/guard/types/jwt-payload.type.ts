import { User } from 'src/user/entity/user.entity';

export type JwtPayloadType = Pick<User, 'id'> & {
  iat: number;
  exp: number;
};
