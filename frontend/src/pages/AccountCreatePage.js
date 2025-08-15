import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../services/api';

function AccountCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', solde: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating account:', form);
      const res = await createAccount(form);
      console.log('Account created:', res.data);
      setForm({ nom: '', solde: '' });
      setError('');
      navigate('/comptes');
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    console.log('Form updated:', { ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          p: 2,
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          borderRadius: 3,
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #1976D2 0%, #FFFFFF 100%)'
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Créer un Compte
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Nom du compte"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
            />
            <TextField
              label="Solde initial (FCFA)"
              name="solde"
              type="number"
              value={form.solde}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
            >
              Créer
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate('/comptes');
                console.log('Navigated back to accounts');
              }}
              sx={{ mt: 2, ml: 2, color: '#1976D2', borderColor: '#1976D2' }}
            >
              Annuler
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AccountCreatePage;