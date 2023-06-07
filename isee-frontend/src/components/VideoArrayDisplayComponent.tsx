import React from 'react';
import { IVideo } from '../interfaces/IVideo';
import { EDisplayType } from '../enums/EDisplayType';
import VideoCard from './VideoCard';
import ExtendedVideoCard from './ExtendedVideoCard';

export default function VideoArrayDisplayComponent(props: {
  videos: IVideo[] | undefined;
  displayType: EDisplayType;
  refetch: () => void;
}) {
  const { videos, displayType, refetch } = props;

  return (
    <div className="flex flex-wrap justify-center">
      {videos?.length ? (
        videos.map((video, index) => {
          return displayType === EDisplayType.GRID ? (
            <VideoCard key={index} {...video} refetch={refetch} />
          ) : (
            <ExtendedVideoCard key={index} {...video} refetch={refetch} />
          );
        })
      ) : (
        <p>No videos found</p>
      )}
    </div>
  );
}
