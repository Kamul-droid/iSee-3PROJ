import React from "react";
import { io, Socket } from "socket.io-client";
import endpoints from "./api/endpoints";

export const socket = io(endpoints.apiBase, {
        autoConnect : false,
        auth        : (cb) => {
            cb({ token : localStorage.getItem('jwt')})
        },
    })

export const SocketContext = React.createContext({} as Socket);