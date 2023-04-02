import React from "react"
import { Link } from "react-router-dom"
import { IComment } from "../interfaces/IComment"

function CommentComponent(props: IComment) {
    return <>
        <Link to={`/users/${props.authorInfos._id}/videos`}>{props.authorInfos.username}</Link>
        <p>{props.content}</p>
    </>
}

export default CommentComponent