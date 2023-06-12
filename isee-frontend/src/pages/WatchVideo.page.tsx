import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import abbreviateNumber from '../helpers/abbreviateNumber';
import formatDate from '../helpers/formatDate';
import CollapsibleTextComponent from '../components/CollapsibleTextComponent';
import AvatarDisplayComponent from '../components/AvatarDisplayComponent';
import { EVideoQuality } from '../enums/EVideoQuality';
import ButtonComponent from '../components/ButtonComponent';
import { EVideoProcessing } from '../enums/EVideoProcessing';

function WatchVideoPage() {
  const user = getUser();
  const playerRef = React.useRef(null);
  const [player, setPLayer] = useState(<></>);
  const [quality, setQuality] = useState(EVideoQuality.AUTO);

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

  const { data } = useQuery<IVideo>({
    queryKey: ['video', videoId],
    queryFn: () => apiFetch(`${endpoints.videos.base}/${videoId}`, 'GET'),
  });

  useEffect(() => {
    if (data) {
      let hlsURL = `hls/${data.videoPath}.source/master.m3u8`;
      if (data.processing === EVideoProcessing.DONE) {
        switch (quality) {
          case EVideoQuality.SOURCE:
            hlsURL = `hls/${data.videoPath}.source/master.m3u8`;
            break;
          case EVideoQuality.AUTO:
            hlsURL = `hls-custom/${data.videoPath}/master.m3u8`;
            break;
          case EVideoQuality.H720:
            hlsURL = `hls-custom/${data.videoPath}/stream-720p.m3u8`;
            break;
          case EVideoQuality.H480:
            hlsURL = `hls-custom/${data.videoPath}/stream-480p.m3u8`;
            break;
          case EVideoQuality.H360:
            hlsURL = `hls-custom/${data.videoPath}/stream-360p.m3u8`;
            break;
        }
      } else {
        setQuality(EVideoQuality.SOURCE);
      }

      console.log(hlsURL);

      videoJsOptions.sources[0].src = `${endpoints.apiBase}/${hlsURL}`;
      const startTime = document.getElementsByTagName('video')?.[0]?.currentTime ?? 0;

      setPLayer(
        <VideoJS
          options={videoJsOptions}
          onReady={handlePlayerReady}
          startTime={startTime}
          className="shadow-md border-2 border-white"
        />,
      );
    }
  }, [data, quality]);

  return (
    <>
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
              {data.processing === EVideoProcessing.NOT_STARTED && (
                <p className="my-2">This video has not been processed, quality options will not be available</p>
              )}
              {data.processing === EVideoProcessing.IN_PROGRESS && (
                <p className="my-2">This video is currently processing, quality options will be available soon.</p>
              )}
              {data.processing === EVideoProcessing.FAILED && (
                <p className="my-2">
                  This video encountered an error while processing, quality options will not be available
                </p>
              )}
              {data.processing === EVideoProcessing.DONE && (
                <div className="flex">
                  {user?._id === data.uploaderInfos._id && (
                    <ButtonComponent
                      className="mx-1"
                      color="light"
                      onClick={() => setQuality(EVideoQuality.SOURCE)}
                      disabled={quality === EVideoQuality.SOURCE}
                    >
                      Source
                    </ButtonComponent>
                  )}
                  <ButtonComponent
                    color="light"
                    className="mx-1"
                    onClick={() => setQuality(EVideoQuality.AUTO)}
                    disabled={quality === EVideoQuality.AUTO}
                  >
                    Auto
                  </ButtonComponent>
                  <ButtonComponent
                    color="light"
                    className="mx-1"
                    onClick={() => setQuality(EVideoQuality.H360)}
                    disabled={quality === EVideoQuality.H360}
                  >
                    360p
                  </ButtonComponent>
                  <ButtonComponent
                    color="light"
                    className="mx-1"
                    onClick={() => setQuality(EVideoQuality.H480)}
                    disabled={quality === EVideoQuality.H480}
                  >
                    480p
                  </ButtonComponent>
                  <ButtonComponent
                    color="light"
                    className="mx-1"
                    onClick={() => setQuality(EVideoQuality.H720)}
                    disabled={quality === EVideoQuality.H720}
                  >
                    720p
                  </ButtonComponent>
                </div>
              )}
              <div className="my-5 p-2 bg-white rounded-lg shadow-md">
                <AvatarDisplayComponent {...data.uploaderInfos} showUsername={true} />
                <hr className="m-2" />
                <p>Posted on {formatDate(data.createdAt, 'en-US')}</p>
                <p>{abbreviateNumber(data.views, 'view', 'views')}</p>
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
