import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { addMovement } from '../services/api';

function FormMovementAdd({ accountId, onSuccess }) {
  const [form, setForm] = useState({ montant: '', libelle: '', type: 'entree' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addMovement(accountId, form);
      setForm({ montant: '', libelle: '', type: 'entree' });
      setError('');
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du mouvement');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          maxWidth: 650,
          mx: 'auto',
          mt: 3,
          bgcolor: '#F5F7FA',
          borderRadius: 3,
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Ajouter un Mouvement</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Montant (FCFA)"
          name="montant"
          type="number"
          value={form.montant}
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
          required
        />
        <TextField
          label="Libellé"
          name="libelle"
          value={form.libelle}
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
        />
        <TextField
          select
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          SelectProps={{ native: true }}
          fullWidth
          sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
        >
          <option value="entree">Entrée</option>
          <option value="sortie">Sortie</option>
        </TextField>
        <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
          Ajouter
        </Button>
      </Box>
    </motion.div>
  );
}

export default FormMovementAdd;
