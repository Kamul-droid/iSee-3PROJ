import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index.page';
import LoginPage from './pages/Login.page';
import RegisterPage from './pages/Register.page';
import extendLocalStorage from './helpers/storageExtension';
import UploadVideoPage from './pages/videos/UploadVideo.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UsersVideosPage from './pages/users/UsersVideos.page';
import WatchVideoPage from './pages/WatchVideo.page';
import SearchPage from './pages/videos/Search.page';
import { socket, SocketContext } from './socket';
import ProfilePage from './pages/Profile.page';
import EditVideoPage from './pages/videos/EditVideo.page';
import AdminDashboardPage from './pages/admin-dashboard/AdminDashboard.page';
import { EDisplayType } from './enums/EDisplayType';
import { Toolbar } from './components/ToolbarComponent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export const DisplayTypeContext = React.createContext({} as any);

function App() {
  extendLocalStorage();
  const [displayType, setDisplayType] = useState(EDisplayType.GRID);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={socket}>
        <DisplayTypeContext.Provider value={{ displayType, setDisplayType }}>
          <BrowserRouter>
            <Toolbar />
            <div className="w-10/12 m-auto">
              <Routes>
                <Route index element={<IndexPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="videos">
                  <Route path="upload" element={<UploadVideoPage />} />
                  <Route path="edit/:videoId" element={<EditVideoPage />} />
                </Route>
                <Route path="users">
                  <Route path=":uploader_id/videos" element={<UsersVideosPage />} />
                </Route>
                <Route path="admin">
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                </Route>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="watch/:videoId" element={<WatchVideoPage />} />
                <Route path="search/:searchQuery" element={<SearchPage />} />
                <Route path="*" element={<p>Page not found</p>} />
              </Routes>
            </div>
          </BrowserRouter>
        </DisplayTypeContext.Provider>
      </SocketContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
