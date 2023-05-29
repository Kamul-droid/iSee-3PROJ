import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';
import abbreviateNumber from '../helpers/abbreviateNumber';

function ExtendedVideoCard(props: IVideo) {
  const navigate = useNavigate();
  const user = getUser();

  const { uploaderInfos, title, thumbnail, _id, description, views, likes } = props;

  const handleEditVideo = () => {
    navigate(`/videos/edit/${_id}`);
  };

  return (
    <>
      <div className="m-2 w-full flex">
        <div className="bg-white w-60 shadow-md rounded-sm shrink-0 h-min">
          <Link to={`/watch/${props._id}`}>
            <img src={`${endpoints.thumbnails.base}/${thumbnail}`} alt={title} className="p-1" />
          </Link>
        </div>
        <div className="relative p-2 group">
          <Link to={`/watch/${props._id}`} className="w-full h-min overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </Link>
          <div className="grid grid-flow-row grid-cols-4 divide-x my-1 w-full items-center bg-white shadow-sm rounded-full">
            <Link to={`/users/${uploaderInfos._id}/videos`} className="w-10 flex items-center">
              <img
                src={`${endpoints.apiBase}profile-pictures/${uploaderInfos.avatar}`}
                alt=""
                className="w-10 rounded-full bg-white shadow-md mr-2"
              ></img>
              <p className="p-1">{uploaderInfos.username}</p>
            </Link>
            <p className="text-center px-2">{abbreviateNumber(views)} views</p>
            <p className="text-center px-2">{abbreviateNumber(likes)} likes </p>
            {user && user._id === uploaderInfos._id && (
              <button onClick={handleEditVideo} className="px-2">
                edit
              </button>
            )}
          </div>
          <p className="py-1">{description.length > 150 ? description.substring(0, 150) + '...' : description}</p>
        </div>
      </div>
      <hr className="w-full" />
    </>
  );
}

export default ExtendedVideoCard;
