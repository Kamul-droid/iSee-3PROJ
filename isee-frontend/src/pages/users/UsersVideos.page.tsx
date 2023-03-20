import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch";
import endpoints from "../../api/endpoints";

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
                    return <div key={index}>
                        <Link to={`/watch/${video._id}`}>{video.title}</Link>
                        <p>{video.description}</p>
                    </div>
                }
            )}
        </div>
    )
}

export default UsersVideosPage