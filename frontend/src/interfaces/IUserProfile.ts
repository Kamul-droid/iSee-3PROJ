import { EUserRole } from '../enums/EUserRole';

export interface IUserProfile {
  username: string;
  email: string;
  avatar: string;
  role: EUserRole;
  createdAt: string;
  bio: string;
  _id: string;
  videosCount: number;
}
