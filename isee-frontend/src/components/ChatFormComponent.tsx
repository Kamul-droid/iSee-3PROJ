import React, { useState } from 'react';
import getUser from '../helpers/getUser';

export function ChatFormComponent(props: any) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { socket, videoId, className } = props;

  function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(2000).emit('chat', { message: value, user: getUser(), videoId }, () => {
      setIsLoading(false);
      event.target.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className={`${className} flex`}>
      <input onChange={(e) => setValue(e.target.value)} className="flex-grow" />

      <button
        type="submit"
        disabled={isLoading}
        className="text-center px-4 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-400"
      >
        Send
      </button>
    </form>
  );
}
