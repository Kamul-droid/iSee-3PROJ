import React, { useCallback, useState } from 'react';
import { IComment } from '../interfaces/IComment';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import getUser from '../helpers/getUser';
import CollapsibleTextComponent from './CollapsibleTextComponent';
import AvatarDisplayComponent from './AvatarDisplayComponent';
import formatDate from '../helpers/formatDate';
import { EUserRole } from '../enums/EUserRole';
import TooltipComponent from './TooltipComponent';
import { MdDelete, MdThumbUp } from 'react-icons/md';
import abbreviateNumber from '../helpers/abbreviateNumber';

function CommentComponent(props: IComment & { onDelete: () => void }) {
  const { authorInfos, content, isLiked, likes, _id, onDelete, createdAt } = props;

  const user = getUser();

  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesState, setLikesState] = useState(likes);

  const handleLikeClick = useCallback(() => {
    apiFetch(`${endpoints.comments.base}/${_id}/like`, 'POST').then((data) => {
      setLikesState(data.likes);
      setIsLikedState((prev) => !prev);
    });
  }, []);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this comment?')) {
      apiFetch(`${endpoints.comments.base}/${_id}`, 'DELETE').then(() => {
        onDelete();
      });
    }
  }, []);

  return (
    <>
      <div className="py-2">
        <AvatarDisplayComponent {...authorInfos} showUsername={true} />
        <p className="text-gray-500">{formatDate(createdAt, 'en-US', true)}</p>
        <CollapsibleTextComponent
          text={content}
          className="p-2 border border-slate-300 rounded-2xl my-2"
          fadeColor="to-slate-50"
          charsThreshold={200}
          linesThreshold={4}
        />
        <div className="flex ">
          <TooltipComponent text="Like this comment">
            <button onClick={handleLikeClick}>
              <MdThumbUp color={isLikedState ? 'blue' : 'grey'} size={20} />
            </button>
          </TooltipComponent>
          <p className="mx-2">{abbreviateNumber(likesState)}</p>
          {(user?.role === EUserRole.ADMIN || user?._id === authorInfos._id) && (
            <TooltipComponent text="Delete this comment">
              <button onClick={handleDelete}>
                <MdDelete size={20} />{' '}
              </button>
            </TooltipComponent>
          )}
        </div>
      </div>
      <hr />
    </>
  );
}

export default CommentComponent;
