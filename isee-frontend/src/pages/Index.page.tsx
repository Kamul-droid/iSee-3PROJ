import { useQuery } from "@tanstack/react-query"
import React from "react"
import { Link } from "react-router-dom"
import { apiFetch } from "../api/apiFetch"
import endpoints from "../api/endpoints"
import VideoCard from "../components/VideoCard"
import getUser from "../helpers/getUser"
import { IVideo } from "../interfaces/IVideo"

function IndexPage() {
    const user = getUser()

    const recentVideosQuery = useQuery<IVideo[]>({
        queryKey : ['recentVideos'],
        queryFn  : () => apiFetch(`${endpoints.videos.base}`, 'GET')
    })

    return (
        <div>
            <h1>Isee front page</h1>
            <p>Welcome to Isee</p>
            { user
                ? <>
                    <p>Welcome {user.username}</p>
                    <button onClick={() => {
                        localStorage.clear();
                        window.location.reload()
                    }}>Logout</button>
                    <Link to='/videos/upload'>Upload a video</Link>
                </> 
                : <>
                    <Link to='/login'>Login</Link><br/>
                    <Link to='/register'>Register</Link><br/>
                </>
            }
            <p>Recent videos</p>
            {recentVideosQuery.data && recentVideosQuery.data.map((video, index) => {
                return <VideoCard key={index} {...video}/>
            })}
        </div>
    )
}

  export default IndexPage