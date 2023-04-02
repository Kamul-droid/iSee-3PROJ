import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { apiFetch } from "../api/apiFetch";
import endpoints from "../api/endpoints";
import { ECommentsSortOrder } from "../enums/ECommentsSortOrder";
import { ICOmmentResponse } from "../interfaces/ICommentResponse";
import CommentComponent from "./CommentComponent";
import CommentFormComponent from "./CommentFormComponent";

function CommentListComponent(props: {videoId: string}) {
    const [sortOrder, setSortOrder] = useState(ECommentsSortOrder.POPULAR);
    const {videoId} = props

    const fetchComments = async({
        pageParam = `${endpoints.comments.fromVideo}/${videoId}`
    }) => {
        const comments = await apiFetch(pageParam, 'GET')
        console.log(comments);
        return comments
    };

    const { 
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        refetch,
     } = useInfiniteQuery<ICOmmentResponse>({
        queryKey         : ['comments', videoId],
        queryFn          : fetchComments,
        getNextPageParam : (lastPage) => lastPage.next,
    });

    return <>
        <CommentFormComponent videoId={videoId} onPostComment={() => {refetch()}}/>
        {data && (
            data.pages.map((group, i) => (
                <React.Fragment key={i}>
                    {
                        group.data.map(((comment, index) => (
                        <CommentComponent key={index} {...comment}/>
                        )))
                    }
                </React.Fragment>
            ))
        )}
        <div>
            <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            >
            {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
            <button onClick={() => refetch()}>Refresh</button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
}

export default CommentListComponent;