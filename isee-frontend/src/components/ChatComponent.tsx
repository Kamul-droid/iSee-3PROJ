import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getUser from '../helpers/getUser';
import { SocketContext } from '../socket';
import { ChatFormComponent } from './ChatFormComponent';

function ChatComponent(props: any) {

    const {videoId} = props

    const [isConnected, setIsConnected] = useState(false);
    const [chatEvents, setChatEvents] = useState([] as any[]);
    const socket = useContext(SocketContext);

    function onChatEvent(value: any) {
      setChatEvents((previous: any) => [...previous, value]);
    }

    const handleOpenChat = useCallback(() => {
      if(socket.disconnected) {
        console.log("connecting socket")
        socket.connect()
      }

      socket.emit("joinRoom", {videoId, user : getUser()}, () => {
        console.log("joined room " + videoId)
        setIsConnected(true)
        socket.on('chat', onChatEvent);
      });
    }, []);
  
    useEffect(() => {
      return () => {
        setIsConnected(false);
        socket.off('chat', onChatEvent);
        if(socket.connected) {
          console.log("disconnecting socket");
          socket.disconnect();
        }
      };
    }, []);

    return(
        <div>
            <p>Connected: {isConnected ? "yes" : "no"}</p>
            {!isConnected && <button onClick={handleOpenChat}>
              Join Chat
            </button>}
            {
              isConnected && <>
                <ChatFormComponent socket={socket} videoId={videoId} />
                {
                  chatEvents.map((e, index) => <div key={index}>
                    {typeof e === 'string' ?
                    <i>{e}</i> :
                    <p><Link to={`/users/${e.user._id}/videos`}>{e.user.username}</Link> : {e.message}</p>
                  }
                  </div>)
                }
              </>
            }
        </div>
    )
}

export default ChatComponent