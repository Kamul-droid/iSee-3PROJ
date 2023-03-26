import React, { useState } from 'react';
import getUser from '../helpers/getUser';

export function ChatFormComponent(props: any) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {socket, videoId} = props;

  function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(2000).emit('chat', {message : value, user : getUser(), videoId}, () => {
      setIsLoading(false);
      event.target.reset()
    });
  }

  return (
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
}