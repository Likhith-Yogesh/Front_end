import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import APITest from './pages/APITest';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for testing purposes
  const handleLogin = (() => {
    setIsAuthenticated(true);
  });
  const handleLogout = (() => {
    setIsAuthenticated(false);
  });

  return (
    <BrowserRouter>
      <div className='min-h-screen bg-slate-900'> 
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/test" element={<APITest />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
