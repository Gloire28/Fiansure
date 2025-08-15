import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Switch, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Logo from '@mui/icons-material/AccountBalance';
import { ThemeContext } from '../context/ThemeContext';

function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1976D2', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Logo sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Finansure</Typography>
        </Box>
        {isAuthenticated && (
          <>
            <IconButton color="inherit" onClick={() => {
              toggleTheme();
              console.log('Theme toggle button clicked');
            }}>
              <Brightness4Icon />
              <Switch checked={mode === 'dark'} />
            </IconButton>
            <Button color="inherit" onClick={() => {
              navigate('/home');
              console.log('Navigated to Home');
            }} sx={{ mx: 1 }}>Accueil</Button>
            <Button color="inherit" onClick={() => {
              navigate('/goals');
              console.log('Navigated to Goals');
            }} sx={{ mx: 1 }}>Objectifs</Button>
            <Button color="inherit" onClick={() => {
              navigate('/comptes');
              console.log('Navigated to Accounts');
            }} sx={{ mx: 1 }}>Comptes</Button>
            <Button color="inherit" onClick={() => {
              onLogout();
              console.log('User logged out');
            }} sx={{ mx: 1 }}>Déconnexion</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;