import { IComment } from "./IComment";

export interface ICommentResponse {
    next: string | null,
    prev: string | null,
    data: IComment[],
    total: number,
}