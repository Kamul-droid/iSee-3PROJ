import React from 'react';
import { IVideo } from '../interfaces/IVideo';
import { EDisplayType } from '../enums/EDisplayType';
import VideoCard from './VideoCard';
import ExtendedVideoCard from './ExtendedVideoCard';

export default function VideoArrayDisplayComponent(props: { videos: IVideo[] | undefined; displayType: EDisplayType }) {
  const { videos, displayType } = props;

  return (
    <div className="flex flex-wrap">
      {videos?.length ? (
        videos.map((video, index) => {
          return displayType === EDisplayType.GRID ? (
            <VideoCard key={index} {...video} />
          ) : (
            <ExtendedVideoCard key={index} {...video} />
          );
        })
      ) : (
        <p>No videos found</p>
      )}
    </div>
  );
}
