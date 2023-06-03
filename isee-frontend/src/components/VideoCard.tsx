import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';
import abbreviateNumber from '../helpers/abbreviateNumber';
import { apiFetch } from '../api/apiFetch';
import { EUserRole } from '../enums/EUserRole';
import AvatarDisplayComponent from './AvatarDisplayComponent';
import ButtonComponent from './ButtonComponent';

function VideoCard(props: IVideo & { onBlockVideo?: () => void }) {
  const navigate = useNavigate();
  const user = getUser();

  const { uploaderInfos, title, thumbnail, _id, description, views, likes, onBlockVideo } = props;

  const handleEditVideo = () => {
    navigate(`/videos/edit/${_id}`);
  };

  const handleBlockVideo = () => {
    if (confirm(`Are you sure you want to block this video?\n${title}`)) {
      apiFetch(`${endpoints.videos.base}/${_id}/block`, 'PATCH', {}).then(() => {
        onBlockVideo?.();
      });
    }
  };

  return (
    <>
      <div className="m-2 max-w-min">
        <div className="bg-white flex-column w-60 shadow-md rounded-sm">
          <Link to={`/watch/${_id}`}>
            <img src={`${endpoints.thumbnails.base}/${thumbnail}`} alt={title} className="p-1" />
          </Link>
        </div>
        <div className="relative py-2 group">
          <div className="flex items-center h-">
            <AvatarDisplayComponent {...uploaderInfos} />
            <Link to={`/watch/${_id}`} className="pl-2 w-52 h-min overflow-hidden whitespace-nowrap text-ellipsis">
              {title}
            </Link>
          </div>
          <div
            className="z-10 scale-y-0 group-hover:scale-y-100 mt-2
            bg-slate-900/70 transition-all absolute rounded-lg shadow-md text-white"
          >
            <div className="w-60 px-2">
              <p className="pb-2 py-2">{uploaderInfos.username}</p>
              <hr />
              <p className="pb-2 py-2 break-words">
                {description.length > 150 ? description.substring(0, 150) + '...' : description}
              </p>
              <hr />
              <div className="grid grid-cols-2 divide-x my-1">
                <p className="text-center">{abbreviateNumber(views, 'view', 'views')}</p>
                <p className="text-center">{abbreviateNumber(likes, 'like', 'likes')}</p>
              </div>
              <div className="flex">
                {user?._id === uploaderInfos._id && (
                  <>
                    <ButtonComponent
                      text="Edit"
                      onClick={handleEditVideo}
                      color="light"
                      className="grow basis-0 mx-1"
                    />
                  </>
                )}
                {user?.role === EUserRole.ADMIN && (
                  <>
                    <ButtonComponent
                      text="Block"
                      onClick={handleBlockVideo}
                      color="red"
                      className="grow basis-0 mx-1"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCard;
