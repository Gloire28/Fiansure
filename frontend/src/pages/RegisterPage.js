import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      localStorage.setItem('userId', res.data.user.userId); // Sauvegarde de userId
      localStorage.setItem('userName', `${res.data.user.nom} ${res.data.user.prenom}`); // Mise à jour du nom
      onLogin(res.data.user.prenom, res.data.user.userId); // Passe prenom et userId à onLogin
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
            Inscription
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, opacity: 0.8 }}>
            Remplissez vos informations pour commencer
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              InputLabelProps={{
                style: { color: 'white' },
                shrink: true,
              }}
              InputProps={{
                style: { color: 'white', borderRadius: 8 },
              }}
            />
            <TextField
              label="Prénom"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              InputLabelProps={{
                style: { color: 'white' },
                shrink: true,
              }}
              InputProps={{
                style: { color: 'white', borderRadius: 8 },
              }}
            />
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
                shrink: true,
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
              variant="outlined"
              InputLabelProps={{
                style: { color: 'white' },
                shrink: true,
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
                S'inscrire
              </Button>
            </motion.div>
            <Button
              onClick={() => navigate('/login')}
              fullWidth
              sx={{
                mt: 2,
                color: '#00c6ff',
                fontWeight: 'bold',
              }}
            >
              Déjà un compte ? Se connecter
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default RegisterPage;