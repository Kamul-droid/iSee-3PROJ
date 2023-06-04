import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getUser from '../helpers/getUser';
import { SocketContext } from '../socket';
import { ChatFormComponent } from './ChatFormComponent';
import ButtonComponent from './ButtonComponent';

function ChatComponent(props: any) {
  const { videoId } = props;

  const user = getUser();

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
    <>
      {isConnected ? (
        <div className="h-full bg-white rounded-md shadow-md p-2">
          <div className="flex flex-col h-full">
            <div className="grow">
              {chatEvents.map((e, index) => (
                <div key={index}>
                  {typeof e === 'string' ? (
                    <i className="break-words">{e}</i>
                  ) : (
                    <p className="break-words">
                      {e.user._id === user?._id ? (
                        <b className="font-semibold">(You)</b>
                      ) : (
                        <Link to={`/users/${e.user._id}/videos`} className="text-blue-600 underline">
                          {e.user.username}
                        </Link>
                      )}
                      {` : ${e.message}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <hr />
            <ChatFormComponent socket={socket} videoId={videoId} className="pt-2" />
          </div>
        </div>
      ) : (
        <>
          <ButtonComponent text="Open chat" onClick={handleOpenChat} className="w-full my-0" />
        </>
      )}
    </>
  );
}

export default ChatComponent;
