import { EUserRole } from '../enums/EUserRole';

export interface IUser {
  username: string;
  email: string;
  avatar: string;
  role: EUserRole;
  _id: string;
}
