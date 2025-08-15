import React, { createContext, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976D2' },
      secondary: { main: '#4CAF50' },
      background: { default: mode === 'light' ? '#F5F7FA' : '#121212', paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E' },
      warning: { main: '#FFCA28' },
      error: { main: '#D32F2F' }
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h4: { fontWeight: 600 },
      h6: { fontWeight: 500 }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            padding: '10px 20px'
          }
        }
      }
    }
  });

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      console.log(`Theme toggled to: ${newMode}`);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};