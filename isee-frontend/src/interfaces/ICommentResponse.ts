import { IComment } from "./IComment";

export interface ICOmmentResponse {
    next: string | null,
    prev: string | null,
    data: IComment[],
    total: number,
}