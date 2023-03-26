import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { getSocket } from '../socket';
import { ChatFormComponent } from './ChatFormComponent';

function ChatComponent(props: any) {

    const {videoId} = props

    const [isConnected, setIsConnected] = useState(false);
    const [chatEvents, setChatEvents] = useState([] as any[]);
    const [socket, setSocket] = useState(null as Socket | null);
  
    useEffect(() => {
      setSocket(getSocket(videoId))
    }, []);
  
    useEffect(() => {
      if(!socket)
        return;
      function onConnect() {
        setIsConnected(true);
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
      function onChatEvent(value: any) {
        setChatEvents((previous: any) => [...previous, value]);
      }

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('chat', onChatEvent);
  
      if(!socket.connected) {
        socket.connect()
      }

      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('chat', onChatEvent);
        socket.disconnect()
        console.log("disconnecting socket")
      };
    }, [socket]);

    return(
        <div>
            <p>Connected: {isConnected ? "yes" : "no"}</p>
            <ChatFormComponent socket={socket} />
            {chatEvents.map((e, index) => <div key={index}>
              <p><Link to={`/users/${e.user._id}/videos`}>{e.user.username}</Link> : {e.message}</p>
            </div>)}
        </div>
    )
}

export default ChatComponent