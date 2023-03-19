import React from "react"
import { Link } from "react-router-dom"
import getUser from "../helpers/getUser"

function IndexPage() {
    const user = getUser()
    return (
        <div>
            <h1>Isee front page</h1>
            <p>Welcome to Isee</p>
            { user
                ? <>
                    <p>Welcome {user.username}</p>
                    <button onClick={() => {
                        localStorage.clear(),
                        window.location.reload()
                    }}>Logout</button>
                    <Link to='/videos/upload'>Upload a video</Link>
                </> 
                : <>
                    <Link to='/login'>Login</Link><br/>
                    <Link to='/register'>Register</Link><br/>
                </>
            }
        </div>
    )
}

export default IndexPage