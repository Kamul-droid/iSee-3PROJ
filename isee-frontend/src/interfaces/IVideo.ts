import { IDates } from "./IDates";
import { IReducedUser } from "./IReducedUser";
import { IVideoState } from "./IVideoState";

export interface IVideo {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoPath: string;
    state: IVideoState;
    views: number;
    uploaderInfos: IReducedUser;
    dates: IDates;
}