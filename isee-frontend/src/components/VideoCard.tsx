import React from "react";
import { Link } from "react-router-dom";
import { IVideo } from "../interfaces/IVideo";

function VideoCard(props: IVideo) {
    return (<>
        <img src={props.thumbnail} alt={props.title} width="150px" /><br />
        <Link to={`/watch/${props._id}`}>{props.title}</Link><br />
        <Link to={`/users/${props.uploaderInfos._id}/videos`}>{props.uploaderInfos.username}</Link>
        <hr />
    </>);
  }

  export default VideoCard