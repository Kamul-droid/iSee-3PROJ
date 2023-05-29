import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router-dom';
import { DisplayTypeContext } from '../App';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import { Toolbar } from '../components/ToolbarComponent';
import VideoArrayDisplayComponent from '../components/VideoArrayDisplayComponent';
import { IPaginatedVideos } from '../interfaces/IPaginatedVideos';
import { IVideo } from '../interfaces/IVideo';

export default function PaginatedVideoListComponent(props: { paginatedUrl: string; queryKey: any[] }) {
  const { ref, inView } = useInView();

  const { paginatedUrl, queryKey } = props;

  const fetchVideos = async ({ pageParam = paginatedUrl }) => {
    const videos = await apiFetch(pageParam, 'GET');
    return videos;
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
    useInfiniteQuery<IPaginatedVideos>({
      queryKey: ['videos', ...queryKey],
      queryFn: fetchVideos,
      getNextPageParam: (lastPage) => lastPage.next,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, data]);

  const { displayType } = useContext(DisplayTypeContext);

  return (
    <>
      <VideoArrayDisplayComponent
        videos={data?.pages.reduce((prev, page) => {
          return prev.concat(page.data);
        }, [] as IVideo[])}
        displayType={displayType}
      />
      {data && (
        <div>
          <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
          </button>
        </div>
      )}
      <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
    </>
  );
}
