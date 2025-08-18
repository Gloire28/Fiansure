import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import { getDiscussions } from '../services/api';

function BottomNav({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getDiscussions(); // Supposons que cela retourne les discussions avec un champ unreadCount
        const totalUnread = res.data.reduce((sum, discussion) => sum + (discussion.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnread);
      } catch (err) {
        console.error('Error fetching unread messages count:', err);
      }
    };
    if (isAuthenticated) fetchUnreadCount();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        borderTopLeftRadius: 16, 
        borderTopRightRadius: 16, 
        overflow: 'hidden',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case '/home': navigate('/home'); break;
            case '/goals': navigate('/goals'); break;
            case '/comptes': navigate('/comptes'); break;
            case '/discussions': navigate('/discussions'); break;
            case '/logout': onLogout(); navigate('/login'); break;
            default: break;
          }
        }}
        showLabels
        sx={{ bgcolor: '#fff', minHeight: 60 }}
      >
        <BottomNavigationAction label="Accueil" value="/home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Objectifs" value="/goals" icon={<SportsScoreIcon />} />
        <BottomNavigationAction label="Comptes" value="/comptes" icon={<BarChartIcon />} />
        <BottomNavigationAction
          label="Discussions"
          value="/discussions"
          icon={
            <Badge badgeContent={unreadMessagesCount} color="error">
              <ChatIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Déconnexion" value="/logout" icon={<LogoutIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;