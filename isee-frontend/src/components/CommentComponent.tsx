import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { IComment } from '../interfaces/IComment';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import getUser from '../helpers/getUser';
import CollapsibleTextComponent from './CollapsibleTextComponent';

function CommentComponent(props: IComment & { onDelete: () => void }) {
  const { authorInfos, content, isLiked, likes, _id, onDelete, createdAt } = props;

  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesState, setLikesState] = useState(likes);

  const handleLikeClick = useCallback(() => {
    apiFetch(`${endpoints.comments.base}/${_id}/like`, 'POST').then((data) => {
      setLikesState(data.likes);
      setIsLikedState((prev) => !prev);
    });
  }, []);

  const handleDelete = useCallback(() => {
    apiFetch(`${endpoints.comments.base}/${_id}`, 'DELETE').then(() => {
      onDelete();
    });
  }, []);

  return (
    <>
      <div className="py-2">
        <Link to={`/users/${authorInfos._id}/videos`} className="flex items-center">
          <img
            src={`${endpoints.apiBase}profile-pictures/${authorInfos.avatar}`}
            alt=""
            className="w-10 rounded-full bg-white shadow-md"
          ></img>
          <p className="h-min px-2">{authorInfos.username}</p>
        </Link>
        <CollapsibleTextComponent
          text={content}
          className="p-2 border-2 border-slate-300 rounded-2xl my-2"
          fadeColor="to-slate-50"
          charsThreshold={200}
          linesThreshold={4}
        />
        <button onClick={handleLikeClick}>{isLikedState ? 'Unlike' : 'Like'}</button>
        {likesState}
        {getUser()?._id === authorInfos._id && <button onClick={handleDelete}>Delete</button>}
      </div>
      <hr />
    </>
  );
}

export default CommentComponent;
