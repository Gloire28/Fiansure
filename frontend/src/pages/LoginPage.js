import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ telephone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      onLogin();
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4">Connexion</Typography>
      <TextField
        label="Numéro de téléphone"
        name="telephone"
        value={form.telephone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Se connecter</Button>
      <Button onClick={() => navigate('/register')} sx={{ mt: 2 }}>S'inscrire</Button>
    </Box>
  );
}

export default LoginPage;