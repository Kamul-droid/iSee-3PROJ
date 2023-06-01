import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getUser from '../helpers/getUser';
import { SocketContext } from '../socket';
import { ChatFormComponent } from './ChatFormComponent';

function ChatComponent(props: any) {
  const { videoId } = props;

  const [isConnected, setIsConnected] = useState(false);
  const [chatEvents, setChatEvents] = useState([] as any[]);
  const socket = useContext(SocketContext);

  function onChatEvent(value: any) {
    setChatEvents((previous: any) => [...previous, value]);
  }

  const handleOpenChat = useCallback(() => {
    if (socket.disconnected) {
      console.log('connecting socket');
      socket.connect();
    }

    socket.emit('joinRoom', { videoId, user: getUser() }, () => {
      console.log('joined room ' + videoId);
      setIsConnected(true);
      socket.on('chat', onChatEvent);
    });
  }, []);

  useEffect(() => {
    return () => {
      setIsConnected(false);
      socket.off('chat', onChatEvent);
      if (socket.connected) {
        console.log('disconnecting socket');
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="h-full bg-white rounded-md shadow-md p-2">
      {!isConnected ? (
        <div className="flex flex-col h-full">
          <div className="grow">
            {chatEvents.map((e, index) => (
              <div key={index}>
                {typeof e === 'string' ? (
                  <i className="break-words">{e}</i>
                ) : (
                  <p className="break-words">
                    <Link to={`/users/${e.user._id}/videos`}>{e.user.username} :</Link> {e.message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <hr />
          <ChatFormComponent socket={socket} videoId={videoId} className="pt-2" />
        </div>
      ) : (
        <>
          <button onClick={handleOpenChat}>Join Chat</button>
        </>
      )}
    </div>
  );
}

export default ChatComponent;
