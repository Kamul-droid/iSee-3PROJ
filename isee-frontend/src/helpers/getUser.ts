import { IUser } from "../interfaces/IUser";

export default () => localStorage.getObject('user') as IUser | null