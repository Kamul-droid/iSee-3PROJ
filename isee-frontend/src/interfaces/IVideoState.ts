import { EVideoVisibility } from "../enums/EVideoVisibility";

export interface IVideoState {
    visibility: EVideoVisibility;
    isDeleted: boolean;
    isBlocked: boolean;
}