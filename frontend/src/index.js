import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';

console.log('Starting application render...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <BrowserRouter>
      <ThemeProvider>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Failed to render application:', error);
}