import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { apiFetch } from "../api/apiFetch";
import endpoints from "../api/endpoints";
import { ECommentsMode } from "../enums/ECommentsSortOrder";
import buildQueryParams from "../helpers/buildQueryParams";
import { ICOmmentResponse } from "../interfaces/ICommentResponse";
import CommentComponent from "./CommentComponent";
import CommentFormComponent from "./CommentFormComponent";

function getCommentsMode(order: ECommentsMode) {
    switch (order) {
        case ECommentsMode.RECENT:
            return {sort : 'createdAt:desc'}
        case ECommentsMode.MINE:
            return {mine : true, sort : 'createdAt:desc'}
        default:
            return {};
    }
}

function CommentListComponent(props: {videoId: string}) {
    const [commentMode, setCommentMode] = useState(ECommentsMode.RECENT);
    const {videoId} = props


    const fetchComments = async({
        pageParam = `${endpoints.comments.fromVideo}/${videoId}${
            buildQueryParams(getCommentsMode(commentMode))
        }`
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
        queryKey         : ['comments', videoId, commentMode],
        queryFn          : fetchComments,
        getNextPageParam : (lastPage) => lastPage.next,
    });

    return <>
        <CommentFormComponent videoId={videoId} onPostComment={() => {refetch()}}/>
        {
            Object.values(ECommentsMode).map((mode, index) => 
                <React.Fragment key={index}>
                <input type='checkbox' checked={commentMode===mode} onChange={() => {
                    setCommentMode(mode)
                }}></input>
                {mode} 
                </React.Fragment>
            )
        }
        <br/>
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