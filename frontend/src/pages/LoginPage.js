import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      const prenom = res.data.user?.prenom || 'Utilisateur';
      onLogin(prenom);
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={8}
          sx={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 4,
            p: 4,
            width: 350,
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
            Bienvenue
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, opacity: 0.8 }}>
            Connectez-vous pour accéder à votre tableau de bord
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Numéro de téléphone"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              InputLabelProps={{
                style: { color: 'white' },
                shrink: true
              }}
              InputProps={{
                style: { color: 'white', borderRadius: 8 },
              }}
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
              InputLabelProps={{
                style: { color: 'white' },
                shrink: true
              }}
              InputProps={{
                style: { color: 'white', borderRadius: 8 },
              }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Se connecter
              </Button>
            </motion.div>
            <Button
              onClick={() => navigate('/register')}
              fullWidth
              sx={{
                mt: 2,
                color: '#00c6ff',
                fontWeight: 'bold',
              }}
            >
              S'inscrire
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default LoginPage;
