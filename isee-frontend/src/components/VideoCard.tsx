import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';

function VideoCard(props: IVideo) {
  const navigate = useNavigate();
  const user = getUser();

  const handleEditVideo = () => {
    navigate(`/videos/edit/${props._id}`);
  };

  return (
    <>
      <img src={`${endpoints.thumbnails.base}/${props.thumbnail}`} alt={props.title} width="150px" />
      <br />
      <Link to={`/watch/${props._id}`}>{props.title}</Link>
      <br />
      <Link to={`/users/${props.uploaderInfos._id}/videos`}>{props.uploaderInfos.username}</Link>
      <br />
      {user && user._id === props.uploaderInfos._id && <button onClick={handleEditVideo}>edit</button>}
      <hr />
    </>
  );
}

export default VideoCard;
