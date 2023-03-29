import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch";
import endpoints from "../../api/endpoints";
import VideoCard from "../../components/VideoCard";

function UsersVideosPage() {
    const { userId } = useParams();

    const videosList: any[] = []

    const { isLoading, error, data } = useQuery({
        queryKey : ['videosFrom', userId],
        queryFn  : () => apiFetch(`${endpoints.videos.from}/${userId}`, 'GET')
    })

    return (
        <div>
            {data && data.map(
                (video: any, index: number) => {
                    return <VideoCard {...video} key={index}/>
                }
            )}
        </div>
    )
}

export default UsersVideosPage