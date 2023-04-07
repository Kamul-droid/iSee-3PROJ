import React, { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { IComment } from "../interfaces/IComment"
import { apiFetch } from "../api/apiFetch"
import endpoints from "../api/endpoints";

function CommentComponent(props: IComment & {onDelete: () => void}) {

    const {authorInfos, content, isLiked, likes, _id, onDelete, createdAt} = props;

    const [isLikedState, setIsLikedState] = useState(isLiked);
    const [likesState, setLikesState] = useState(likes);

    const handleLikeClick = useCallback(() => {
        apiFetch<IComment>(`${endpoints.comments.base}/${_id}/like`, 'POST')
            .then(data => {
                setLikesState(data.likes);
                setIsLikedState(prev => !prev);
            })
    }, [])

    const handleDelete = useCallback(() => {
        apiFetch(`${endpoints.comments.base}/${_id}`, 'DELETE')
        .then(() => {
            onDelete()
        })
    }, [])

    return <>
        <Link to={`/users/${authorInfos._id}/videos`}>{authorInfos.username}</Link>
        : {createdAt}
        <p>{content}</p>
        <button onClick={handleLikeClick}>{isLikedState ? 'Unlike' : 'Like'}</button>
        Likes: {likesState}
        <button onClick={handleDelete}>Delete</button>
        <hr/>
    </>
}

export default CommentComponent