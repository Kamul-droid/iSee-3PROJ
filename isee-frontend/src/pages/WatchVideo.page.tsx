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
import CollapsibleTextComponent from '../components/CollapsibleTextComponent';
import AvatarDisplayComponent from '../components/AvatarDisplayComponent';

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
      console.log(data.uploaderInfos);
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
                <AvatarDisplayComponent {...data.uploaderInfos} showUsername={true} />
                <hr className="m-2" />
                <p>Posted on {formatDate(data.createdAt, 'en-US')}</p>
                <p>{abbreviateNumber(data.views)} views</p>
                <hr className="m-2" />
                <CollapsibleTextComponent text={data.description} />
              </div>
              <hr className="my-2" />
              <CommentListComponent videoId={videoId} />
            </>
          ) : (
            <p>{data?.state}</p>
          )}
        </div>
        <div className="sticky top-5 h-[60vh]">{getUser() && <ChatComponent videoId={videoId} />}</div>
      </div>
    </>
  );
}

export default WatchVideoPage;
