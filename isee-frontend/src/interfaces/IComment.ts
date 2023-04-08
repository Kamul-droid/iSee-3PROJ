import { ICommentState } from "./ICommentState";
import { IReducedUser } from "./IReducedUser";

export interface IComment {
    _id: string;
    content: string;
    videoid: string;
    state: ICommentState;
    authorInfos: IReducedUser;
    likes: number;
    isLiked: boolean;
    createdAt: Date;
    updatedAt: Date;
  }