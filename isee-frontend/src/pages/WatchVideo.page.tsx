import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import videojs from 'video.js';
import VideoJS from '../components/VideoJs';
import { IVideo } from '../interfaces/IVideo';
import ChatComponent from '../components/ChatComponent';
import getUser from '../helpers/getUser';
import CommentListComponent from '../components/CommentListComponent';
import { EVideoState } from '../enums/EVideoState';
import { IUser } from '../interfaces/IUser';
import { Toolbar } from '../components/ToolbarComponent';
import abbreviateNumber from '../helpers/abbreviateNumber';
import formatDate from '../helpers/formatDate';
import isOverflown from '../helpers/isOverflown';
import CollapsibleTextComponent from '../components/CollapsibleTextComponent';

function WatchVideoPage() {
  const playerRef = React.useRef(null);
  const [player, setPLayer] = useState(<></>);

  const canWatchVideo = (video?: IVideo, user?: IUser) => {
    return (
      video?.state === EVideoState.PUBLIC ||
      video?.state === EVideoState.UNLISTED ||
      (video?.state === EVideoState.PRIVATE && video?.uploaderInfos._id === user?._id)
    );
  };

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: '',
        type: 'application/x-mpegURL',
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });

    apiFetch(`${endpoints.videos.base}/${videoId}/add-view`, 'POST');
  };

  const { videoId } = useParams();

  const { isLoading, error, data } = useQuery<IVideo>({
    queryKey: ['video', videoId],
    queryFn: () => apiFetch(`${endpoints.videos.base}/${videoId}`, 'GET'),
  });

  useEffect(() => {
    if (data) {
      videoJsOptions.sources[0].src = `${endpoints.apiBase}hls/${data.videoPath}/master.m3u8`;
      setPLayer(<VideoJS options={videoJsOptions} onReady={handlePlayerReady} className="shadow-md" />);
    }
  }, [data]);

  return (
    <>
      <Toolbar />
      <div className="grid grid-flow-row-dense grid-cols-3 gap-2">
        <div className="col-span-2">
          {videoId && data && canWatchVideo(data, getUser() || undefined) ? (
            <>
              <div>
                {player}
                <p className="font-medium text-lg bg-white py-1 px-10 rounded-b-full w-max shadow-md m-auto">
                  {data.title}
                </p>
              </div>
              <div className="my-5 p-2 bg-white rounded-lg shadow-md">
                <Link to={`/users/${data.uploaderInfos._id}/videos`} className="flex items-center">
                  <img
                    src={`${endpoints.apiBase}profile-pictures/${data.uploaderInfos.avatar}`}
                    alt=""
                    className="w-10 rounded-full bg-white shadow-md"
                  ></img>
                  <p className="h-min px-2">{data.uploaderInfos.username}</p>
                </Link>
                <hr className="m-2" />
                <p>Posted on {formatDate(data.createdAt, 'en-US')}</p>
                <p>{abbreviateNumber(data.views)} views</p>
                <hr className="m-2" />
                <CollapsibleTextComponent text={data.description} />
              </div>
              <CommentListComponent videoId={videoId} />
            </>
          ) : (
            <p>{data?.state}</p>
          )}
        </div>
        <div className="sticky top-0 py-2 h-[60vh]">{getUser() && <ChatComponent videoId={videoId} />}</div>
      </div>
    </>
  );
}

export default WatchVideoPage;
