import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';
import abbreviateNumber from '../helpers/abbreviateNumber';
import { EUserRole } from '../enums/EUserRole';
import { apiFetch } from '../api/apiFetch';
import { EVideoState } from '../enums/EVideoState';

function ExtendedVideoCard(props: IVideo) {
  const navigate = useNavigate();
  const user = getUser();

  const { uploaderInfos, title, thumbnail, _id, description, views, likes, state } = props;

  const [videoState, setVideoState] = useState(state);

  const handleEditVideo = () => {
    navigate(`/videos/edit/${_id}`);
  };

  const handleBlockVideo = () => {
    if (confirm(`Are you sure you want to block this video?\n${title}`)) {
      apiFetch(`${endpoints.videos.base}/${_id}/block`, 'PATCH', {}).then(() => {
        setVideoState(EVideoState.BLOCKED);
      });
    }
  };

  return (
    <>
      <div className="m-2 w-full flex">
        <div className="bg-white w-60 shadow-md rounded-sm shrink-0 h-min">
          <Link to={`/watch/${props._id}`}>
            <img src={`${endpoints.thumbnails.base}/${thumbnail}`} alt={title} className="p-1" />
          </Link>
        </div>
        <div className="relative p-2">
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
            <div className="group relative">
              <p className="text-center px-2"> ... </p>
              <div className="hidden group-hover:block absolute top-full w-full z-10 py-2">
                <div className="rounded-lg bg-white shadow-sm flex flex-col justify-center">
                  {user?._id === uploaderInfos._id && (
                    <button onClick={handleEditVideo} className="p-2 w-full">
                      edit
                    </button>
                  )}
                  {user?.role === EUserRole.ADMIN && (
                    <button onClick={handleBlockVideo} className="p-2 w-full">
                      block
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <p className="py-1">{description.length > 150 ? description.substring(0, 150) + '...' : description}</p>
        </div>
      </div>
      <hr className="w-full" />
    </>
  );
}

export default ExtendedVideoCard;
