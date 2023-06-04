import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { DisplayTypeContext } from '../App';
import { apiFetch } from '../api/apiFetch';
import VideoArrayDisplayComponent from '../components/VideoArrayDisplayComponent';
import { IPaginatedVideos } from '../interfaces/IPaginatedVideos';
import { IVideo } from '../interfaces/IVideo';

export default function PaginatedVideoListComponent(props: { paginatedUrl: string; queryKey: any[] }) {
  const { ref, inView } = useInView();

  const [canFetch, setCanFetch] = useState(false);

  const { paginatedUrl, queryKey } = props;

  const fetchVideos = async ({ pageParam = paginatedUrl }) => {
    console.log('triggering fetch');
    setCanFetch(false);
    setTimeout(() => {
      setCanFetch(true);
    }, 500);
    const videos = await apiFetch(pageParam, 'GET');
    return videos;
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } =
    useInfiniteQuery<IPaginatedVideos>({
      queryKey: ['videos', ...queryKey],
      queryFn: fetchVideos,
      getNextPageParam: (lastPage) => lastPage.next,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const { displayType } = useContext(DisplayTypeContext);

  return (
    <>
      <VideoArrayDisplayComponent
        videos={data?.pages.reduce((prev, page) => {
          return prev.concat(page.data);
        }, [] as IVideo[])}
        displayType={displayType}
        refetch={refetch}
      />
      {data && (
        <div>
          <button
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="p-2 rounded-lg my-2 disabled:bg-slate-200 disabled:text-gray-600 text-black border border-slate-300 bg-white hover:bg-slate-100"
          >
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
          </button>
        </div>
      )}
      {isFetching && !isFetchingNextPage && <div>Background Updating...</div>}
    </>
  );
}
