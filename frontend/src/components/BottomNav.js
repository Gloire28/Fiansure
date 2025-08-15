import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';

function BottomNav({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

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
        <BottomNavigationAction label="Déconnexion" value="/logout" icon={<LogoutIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
