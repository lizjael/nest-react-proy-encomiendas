import { Role } from '../enums/rol.enum';

export interface UserActiveInterface {
  sub: number;
  email: string;
  role: Role;
}
