import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch, Box, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { ThemeContext } from '../context/ThemeContext';

function Header({ isAuthenticated, userName }) {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1976D2', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* App Name */}
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Finansure
        </Typography>

        {/* Theme Toggle */}
        {isAuthenticated && (
          <Tooltip title={`Basculer en mode ${mode === 'dark' ? 'clair' : 'sombre'}`}>
            <IconButton onClick={toggleTheme} sx={{ color: '#fff' }}>
              <Brightness4Icon />
              <Switch checked={mode === 'dark'} size="small" sx={{ ml: 0.5 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* User Info */}
        {isAuthenticated && (
          <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
            {userName || 'Utilisateur'}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
