import { useQuery } from "@tanstack/react-query"
import React from "react"
import { useParams } from "react-router-dom"
import { apiFetch } from "../../api/apiFetch"
import endpoints from "../../api/endpoints"
import VideoCard from "../../components/VideoCard"
import buildQueryParams from "../../helpers/buildQueryParams"
import { IVideo } from "../../interfaces/IVideo"

function SearchPage() {
    const { query } = useParams()

    const recentVideosQuery = useQuery<IVideo[]>({
        queryKey : ['searchVideos', query],
        queryFn  : () => apiFetch(`${endpoints.videos.search}${buildQueryParams({query})}`, 'GET')
    })

    return (
        <div>
            <h1>Search</h1>
            <p>Results for {query}</p>
            {recentVideosQuery.data && recentVideosQuery.data.map((video, index) => {
                return <VideoCard key={index} {...video}/>
            })}
        </div>
    )
}

  export default SearchPage