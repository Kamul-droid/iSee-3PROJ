import { IVideo } from './IVideo';

export interface IPaginatedVideos {
  data: IVideo[];
  next: string;
  prev: string;
}
