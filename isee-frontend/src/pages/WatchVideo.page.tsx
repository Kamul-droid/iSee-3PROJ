import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";
import endpoints from "../api/endpoints";
import videojs from "video.js";
import VideoJS from "../components/VideoJs";
import { IVideo } from "../interfaces/IVideo";

function WatchVideoPage() {
    const playerRef = React.useRef(null);
    const [player, setPLayer] = useState(<></>);

    const videoJsOptions = {
      autoplay   : true,
      controls   : true,
      responsive : true,
      fluid      : true,
      sources    : [{
        src  : '',
        type : 'application/x-mpegURL'
      }]
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
    };
    
    const { videoId } = useParams();

    const { isLoading, error, data } = useQuery<IVideo>({
        queryKey : ['video', videoId],
        queryFn  : () => apiFetch(`${endpoints.videos.base}/${videoId}`, 'GET')
    })

    useEffect(() => {
        if (data) {
            console.log(`${endpoints.apiBase}hls/${data.videoPath}`)
            videoJsOptions.sources[0].src = `${endpoints.apiBase}/hls/${data.videoPath}/master.m3u8`
            setPLayer(<VideoJS options={videoJsOptions} onReady={handlePlayerReady} />)
        }
    }, [data])

    return (
        <>
            {player}
        </>
    )
}

export default WatchVideoPage