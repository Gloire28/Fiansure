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
      console.log('Adding movement:', { accountId, ...form });
      const res = await addMovement(accountId, form);
      console.log('Movement added:', res.data);
      setForm({ montant: '', libelle: '', type: 'entree' });
      setError('');
      onSuccess(res.data); // Appeler onSuccess avec les données mises à jour
    } catch (err) {
      console.error('Error adding movement:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du mouvement');
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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, maxWidth: 600, mx: 'auto', mt: 2, bgcolor: '#F5F7FA', borderRadius: 2 }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Ajouter un Mouvement
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Montant (FCFA)"
          name="montant"
          type="number"
          value={form.montant}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
        />
        <TextField
          label="Libellé"
          name="libelle"
          value={form.libelle}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          margin="normal"
          sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
        >
          <option value="entree">Entrée</option>
          <option value="sortie">Sortie</option>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
        >
          Ajouter
        </Button>
      </Box>
    </motion.div>
  );
}

export default FormMovementAdd;