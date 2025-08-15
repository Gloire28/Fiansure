import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      onLogin();
      alert('Bienvenue sur Finansure ! Créez des objectifs ou comptes depuis le tableau de bord.');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4">Inscription</Typography>
      <TextField
        label="Nom"
        name="nom"
        value={form.nom}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Prénom"
        name="prenom"
        value={form.prenom}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
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
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>S'inscrire</Button>
      <Button onClick={() => navigate('/login')} sx={{ mt: 2 }}>Se connecter</Button>
    </Box>
  );
}

export default RegisterPage;