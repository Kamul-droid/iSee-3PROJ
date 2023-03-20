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

const queryClient = new  QueryClient()

function App() {
  extendLocalStorage()

  return (
    <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
