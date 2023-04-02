import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index.page';
import LoginPage from './pages/Login.page';
import RegisterPage from './pages/Register.page';
import extendLocalStorage from './helpers/storageExtension'
import UploadVideoPage from './pages/videos/UploadVideo.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UsersVideosPage from './pages/users/UsersVideos.page';
import WatchVideoPage from './pages/WatchVideo.page';
import SearchPage from './pages/videos/Search.page';
import { socket, SocketContext } from './socket';

const queryClient = new  QueryClient({
  defaultOptions : {
    queries : {
      refetchOnWindowFocus : false, // default: true
    },
  }
})

function App() {
  extendLocalStorage()

  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={socket} >        
        <BrowserRouter>
          <Routes>
            <Route index element={<IndexPage/>} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="videos">
              <Route path="upload" element={<UploadVideoPage/>} />
            </Route>
            <Route path="users">
              <Route path=":userId/videos" element={<UsersVideosPage/>}/>
            </Route>
            <Route path="watch/:videoId" element={<WatchVideoPage/>}/>
            <Route path="search/:query" element={<SearchPage/>}/>
            <Route path="*" element={<p>Page not found</p>} />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
