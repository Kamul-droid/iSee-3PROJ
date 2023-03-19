import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index.page';
import LoginPage from './pages/Login.page';
import RegisterPage from './pages/Register.page';
import extendLocalStorage from './helpers/storageExtension'
import UploadVideoPage from './pages/videos/UploadVideo.page';

function App() {
  extendLocalStorage()

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<IndexPage/>} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="videos">
          <Route path="upload" element={<UploadVideoPage/>} />
        </Route>
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
