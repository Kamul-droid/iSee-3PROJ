import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login.page';
import RegisterPage from './pages/Register.page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<p>This is home page</p>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
