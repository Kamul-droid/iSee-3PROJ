import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';
import abbreviateNumber from '../helpers/abbreviateNumber';
import { apiFetch } from '../api/apiFetch';
import { EVideoState } from '../enums/EVideoState';
import { EUserRole } from '../enums/EUserRole';

function VideoCard(props: IVideo) {
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
      <div className="m-2 max-w-min">
        <div className="bg-white flex-column w-60 shadow-md rounded-sm">
          <Link to={`/watch/${props._id}`}>
            <img src={`${endpoints.thumbnails.base}/${props.thumbnail}`} alt={props.title} className="p-1" />
          </Link>
        </div>
        <div className="relative py-2 group">
          <div className="flex items-center h-">
            <Link to={`/users/${uploaderInfos._id}/videos`} className="w-10">
              <img
                src={`${endpoints.apiBase}profile-pictures/${uploaderInfos.avatar}`}
                alt=""
                className="rounded-full bg-white shadow-md"
              ></img>
            </Link>
            <Link
              to={`/watch/${props._id}`}
              className="pl-2 w-52 h-min overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {title}
            </Link>
          </div>
          <div
            className="z-10 w-0 overflow-hidden group-hover:w-full mt-2
          bg-white transition-all absolute rounded-lg shadow-md"
          >
            <div className="w-60 px-2">
              <p className="pb-2 py-2">
                {description.length > 150 ? description.substring(0, 150) + '...' : description}
              </p>
              <hr />
              <div className="grid grid-cols-2 divide-x my-1">
                <p className="text-center">{abbreviateNumber(views)} views</p>
                <p className="text-center">{abbreviateNumber(likes)} likes </p>
              </div>
              {user?._id === uploaderInfos._id && (
                <>
                  <hr />
                  <button className="py-2" onClick={handleEditVideo}>
                    edit
                  </button>
                </>
              )}
              {user?.role === EUserRole.ADMIN && (
                <>
                  <hr />
                  <button className="py-2" onClick={handleBlockVideo}>
                    block
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCard;
