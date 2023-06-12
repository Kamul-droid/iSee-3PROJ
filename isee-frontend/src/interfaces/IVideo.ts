import { EVideoProcessing } from '../enums/EVideoProcessing';
import { EVideoState } from '../enums/EVideoState';
import { IReducedUser } from './IReducedUser';

export interface IVideo {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoPath: string;
  state: EVideoState;
  views: number;
  likes: number;
  uploaderInfos: IReducedUser;
  createdAt: string;
  processing: EVideoProcessing;
}
