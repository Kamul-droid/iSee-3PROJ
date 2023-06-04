import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';
import abbreviateNumber from '../helpers/abbreviateNumber';
import { apiFetch } from '../api/apiFetch';
import { EUserRole } from '../enums/EUserRole';
import AvatarDisplayComponent from './AvatarDisplayComponent';
import ButtonComponent from './ButtonComponent';
import { MdBlock, MdDelete, MdDrafts, MdDraw, MdEdit, MdLock, MdUnpublished, MdVisibilityOff } from 'react-icons/md';
import TooltipComponent from './TooltipComponent';
import { EVideoState } from '../enums/EVideoState';

function VideoCard(props: IVideo & { refetch?: () => void }) {
  const navigate = useNavigate();
  const user = getUser();

  const { uploaderInfos, title, thumbnail, _id, description, views, likes, state, refetch } = props;

  const handleEditVideo = () => {
    navigate(`/videos/edit/${_id}`);
  };

  const handleBlockVideo = () => {
    if (confirm(`Are you sure you want to block this video?\n${title}`)) {
      apiFetch(`${endpoints.videos.base}/${_id}/block`, 'PATCH', {}).then(() => {
        refetch?.();
      });
    }
  };

  const handleDeleteVideo = () => {
    if (confirm('Are you sure you want to delete this video')) {
      apiFetch(`${endpoints.videos.base}/${_id}/file`, 'DELETE')
        .then(() => {
          refetch?.();
        })
        .catch();
    }
  };

  return (
    <>
      <div className="m-2 max-w-min">
        <div className="bg-white flex-column w-60 shadow-md rounded-sm relative">
          <Link to={`/watch/${_id}`}>
            <img src={`${endpoints.thumbnails.base}/${thumbnail}`} alt={title} className="p-1" />
          </Link>
          {state !== EVideoState.PUBLIC && (
            <>
              <div className="absolute inset-0 bg-slate-900/70 text-white flex items-center justify-center">
                {state === EVideoState.BLOCKED && (
                  <TooltipComponent text="This video has been blocked">
                    <MdBlock size={75} />
                  </TooltipComponent>
                )}
                {state === EVideoState.UNLISTED && (
                  <TooltipComponent text="This video is unlisted">
                    <MdVisibilityOff size={75} />
                  </TooltipComponent>
                )}
                {state === EVideoState.PRIVATE && (
                  <TooltipComponent text="This video is private">
                    <MdLock size={75} />
                  </TooltipComponent>
                )}
                {state === EVideoState.DRAFT && (
                  <TooltipComponent text="This video is not yet uploaded">
                    <MdDraw size={75} />
                  </TooltipComponent>
                )}
              </div>
            </>
          )}
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
              <p className="my-2">{uploaderInfos.username}</p>
              <hr className="my-2" />
              <p className=" break-words">
                {description.length > 150 ? description.substring(0, 150) + '...' : description}
              </p>
              <hr className="my-2" />
              <div className="grid grid-cols-2 divide-x my-1">
                <p className="text-center">{abbreviateNumber(views, 'view', 'views')}</p>
                <p className="text-center">{abbreviateNumber(likes, 'like', 'likes')}</p>
              </div>
              <div className="flex">
                {user?._id === uploaderInfos._id && (
                  <>
                    <TooltipComponent text="Edit video" className="grow basis-0 py-2">
                      <button onClick={handleEditVideo} className="w-full h-full flex justify-center items-center">
                        <MdEdit size={25} />
                      </button>
                    </TooltipComponent>
                    <TooltipComponent text="Delete video" className="grow basis-0 py-2">
                      <button onClick={handleDeleteVideo} className="w-full h-full flex justify-center items-center">
                        <MdDelete size={25} />
                      </button>
                    </TooltipComponent>
                  </>
                )}
                {user?.role === EUserRole.ADMIN && state !== EVideoState.BLOCKED && (
                  <TooltipComponent text="Block video" className="grow basis-0 py-2">
                    <button onClick={handleBlockVideo} className="w-full h-full flex justify-center items-center">
                      <MdBlock size={25} />
                    </button>
                  </TooltipComponent>
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
