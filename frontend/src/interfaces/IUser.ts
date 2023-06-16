import { EUserRole } from '../enums/EUserRole';

export interface IUser {
  username: string;
  email: string;
  avatar: string;
  role: EUserRole;
  createdAt: string;
  bio: string;
  _id: string;
  state: { isEmailValidated: boolean };
}
