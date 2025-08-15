import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import GoalCreatePage from './pages/GoalCreatePage';
import GoalsTrashPage from './pages/GoalsTrashPage';
import GoalsExpiredPage from './pages/GoalsExpiredPage';
import AccountsPage from './pages/AccountsPage';
import AccountDetailPage from './pages/AccountDetailPage';
import AccountCreatePage from './pages/AccountCreatePage';
import AccountsTrashPage from './pages/AccountsTrashPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
    console.log('User logged in');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <RegisterPage onLogin={handleLogin} />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/goals" element={isAuthenticated ? <GoalsPage /> : <Navigate to="/login" />} />
        <Route path="/goals/new" element={isAuthenticated ? <GoalCreatePage /> : <Navigate to="/login" />} />
        <Route path="/goals/trash" element={isAuthenticated ? <GoalsTrashPage /> : <Navigate to="/login" />} />
        <Route path="/goals/expired" element={isAuthenticated ? <GoalsExpiredPage /> : <Navigate to="/login" />} />
        <Route path="/goals/:id" element={isAuthenticated ? <GoalDetailPage /> : <Navigate to="/login" />} />
        <Route path="/comptes" element={isAuthenticated ? <AccountsPage /> : <Navigate to="/login" />} />
        <Route path="/comptes/new" element={isAuthenticated ? <AccountCreatePage /> : <Navigate to="/login" />} />
        <Route path="/comptes/trash" element={isAuthenticated ? <AccountsTrashPage /> : <Navigate to="/login" />} />
        <Route path="/comptes/:id" element={isAuthenticated ? <AccountDetailPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;