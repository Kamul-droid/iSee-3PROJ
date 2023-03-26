import { io } from "socket.io-client";
import endpoints from "./api/endpoints";

export function getSocket(videoId: string) {
    return io(endpoints.apiBase, {
        autoConnect : false,
        auth        : (cb) => {
            cb({ token : localStorage.getItem('jwt')})
        },
        query : {videoId}
    })
}