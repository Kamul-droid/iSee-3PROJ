import { ICommentState } from "./ICommentState";
import { IDates } from "./IDates";
import { IReducedUser } from "./IReducedUser";

export interface IComment {
    _id: string;
    content: string;
    videoid: string;
    state: ICommentState;
    authorInfos: IReducedUser;
    dates: IDates;
  }