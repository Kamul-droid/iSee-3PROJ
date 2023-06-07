import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import { ECommentsMode } from '../enums/ECommentsSortOrder';
import buildQueryParams from '../helpers/buildQueryParams';
import { ICommentResponse } from '../interfaces/ICommentResponse';
import CommentComponent from './CommentComponent';
import CommentFormComponent from './CommentFormComponent';
import { Form, Formik } from 'formik';
import LabelledSelectComponent from './LabelledSelectComponent';
import { useInView } from 'react-intersection-observer';

function getCommentsMode(order: ECommentsMode) {
  switch (order) {
    case ECommentsMode.RECENT:
      return { sort: 'createdAt:desc' };
    case ECommentsMode.MINE:
      return { mine: true, sort: 'createdAt:desc' };
    case ECommentsMode.POPULAR:
      return { sort: 'likes:desc,createdAt:desc' };
    default:
      return {};
  }
}

function CommentListComponent(props: { videoId: string }) {
  const [commentMode, setCommentMode] = useState(ECommentsMode.POPULAR);
  const { ref, inView } = useInView();
  const { videoId } = props;

  const initialValues = {
    commentMode: commentMode,
  };

  const fetchComments = async ({
    pageParam = `${endpoints.comments.fromVideo}/${videoId}${buildQueryParams(getCommentsMode(commentMode))}`,
  }) => {
    const comments = await apiFetch(pageParam, 'GET');
    return comments;
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } =
    useInfiniteQuery<ICommentResponse>({
      queryKey: ['comments', videoId, commentMode],
      queryFn: fetchComments,
      getNextPageParam: (lastPage) => (lastPage.next ? `${endpoints.apiBase.slice(0, -1)}${lastPage.next}` : null),
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <CommentFormComponent
        videoId={videoId}
        onPostComment={() => {
          refetch();
        }}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          return;
        }}
      >
        <Form>
          <LabelledSelectComponent
            name="commentMode"
            label="Sort mode"
            onChange={(e) => {
              setCommentMode(e.target.value);
              refetch();
            }}
          >
            {Object.values(ECommentsMode).map((state, index) => {
              return (
                <option key={index} value={state}>
                  {state}
                </option>
              );
            })}
          </LabelledSelectComponent>
        </Form>
      </Formik>
      <hr />
      {data &&
        data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((comment) => (
              <CommentComponent key={comment._id} {...comment} onDelete={() => refetch()} />
            ))}
          </React.Fragment>
        ))}
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

export default CommentListComponent;
