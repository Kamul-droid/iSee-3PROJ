import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IVideo } from '../interfaces/IVideo';
import getUser from '../helpers/getUser';
import abbreviateNumber from '../helpers/abbreviateNumber';
import { EUserRole } from '../enums/EUserRole';
import { apiFetch } from '../api/apiFetch';
import AvatarDisplayComponent from './AvatarDisplayComponent';
import ButtonComponent from './ButtonComponent';
import TooltipComponent from './TooltipComponent';
import { MdBlock, MdDelete, MdEdit } from 'react-icons/md';

function ExtendedVideoCard(props: IVideo & { refetch?: () => void }) {
  const navigate = useNavigate();
  const user = getUser();

  const { uploaderInfos, title, thumbnail, _id, description, views, likes, refetch } = props;

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
      <div className="m-2 w-full flex">
        <div className="bg-white w-60 shadow-md rounded-sm shrink-0 h-min">
          <Link to={`/watch/${props._id}`}>
            <img src={`${endpoints.thumbnails.base}/${thumbnail}`} alt={title} className="p-1" />
          </Link>
        </div>
        <div className="relative m-2 grow shrink min-w-0 ">
          <Link to={`/watch/${props._id}`} className="w-full h-min overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </Link>
          <div className="grid grid-flow-row grid-cols-4 divide-x my-1 gap-3 w-full items-center bg-white shadow-sm rounded-full">
            <AvatarDisplayComponent {...uploaderInfos} showUsername={true} />
            <p className="text-center px-2">{abbreviateNumber(views, 'view', 'views')}</p>
            <p className="text-center px-2">{abbreviateNumber(likes, 'like', 'likes')}</p>
            <div className="relative py-2 flex">
              {user?._id === uploaderInfos._id && (
                <>
                  <TooltipComponent text="Edit video" className="grow basis-0 mx-1">
                    <button onClick={handleEditVideo} className="w-full h-full flex justify-center items-center">
                      <MdEdit size={25} />
                    </button>
                  </TooltipComponent>
                  <TooltipComponent text="Delete video" className="grow basis-0 mx-1">
                    <button onClick={handleDeleteVideo} className="w-full h-full flex justify-center items-center">
                      <MdDelete size={25} />
                    </button>
                  </TooltipComponent>
                </>
              )}
              {user?.role === EUserRole.ADMIN && (
                <TooltipComponent text="Block video" className="grow basis-0 mx-1">
                  <button onClick={handleBlockVideo} className="w-full h-full flex justify-center items-center">
                    <MdBlock size={25} />
                  </button>
                </TooltipComponent>
              )}
            </div>
          </div>
          <p className="py-1  break-words">
            {description.length > 150 ? description.substring(0, 150) + '...' : description}
          </p>
        </div>
      </div>
      <hr className="w-full" />
    </>
  );
}

export default ExtendedVideoCard;
