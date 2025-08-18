import React, { useState, useEffect } from 'react';
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
import BottomNav from './components/BottomNav';
import DiscussionsPage from './pages/DiscussionsPage';
import MessageDetailPage from './pages/MessageDetailPage';
import { getDiscussions } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || ''); // Ajout de userId
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated) {
        try {
          const res = await getDiscussions();
          const totalUnread = res.data.reduce((sum, disc) => sum + (disc.unreadCount || 0), 0);
          setUnreadMessagesCount(totalUnread);
        } catch (err) {
          console.error('Error fetching discussions:', err);
        }
      }
    };
    fetchUnreadCount();
  }, [isAuthenticated]);

  const handleLogin = (name, userId) => { // Accepter userId comme paramètre
    setIsAuthenticated(true);
    setUserName(name);
    setUserId(userId); // Mettre à jour userId
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', userId); // Sauvegarder userId
    console.log('User logged in with name:', name, 'and userId:', userId);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserName('');
    setUserId(''); // Réinitialiser userId
    setUnreadMessagesCount(0);
    console.log('User logged out');
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} userName={userName} />
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
        <Route path="/discussions" element={isAuthenticated ? <DiscussionsPage /> : <Navigate to="/login" />} />
        <Route path="/discussions/:accountId" element={isAuthenticated ? <MessageDetailPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <BottomNav isAuthenticated={isAuthenticated} onLogout={handleLogout} unreadMessagesCount={unreadMessagesCount} />
    </>
  );
}

export default App;