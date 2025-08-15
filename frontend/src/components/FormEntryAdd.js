import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { addEntry } from '../services/api';
import { isPositiveAmount } from '../utils/validationUtils';

function FormEntryAdd({ goalId, onSuccess }) {
  const [form, setForm] = useState({ montant: '', libelle: '' });
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPositiveAmount(form.montant)) {
      setError('Montant doit être positif');
      console.log('Validation error: Montant non positif', form.montant);
      return;
    }
    setOpenDialog(true); // Ouvre le pop-up au lieu d'envoyer directement
  };

  const handleConfirm = async () => {
    try {
      const res = await addEntry(goalId, form);
      console.log('Entry added successfully:', res.data);
      onSuccess(res.data);
      setForm({ montant: '', libelle: '' });
      setError('');
      setOpenDialog(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'ajout';
      setError(errorMessage);
      console.error('Error adding entry:', err.response?.status, errorMessage);
      setOpenDialog(false);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <TextField
        label="Montant (FCFA)"
        name="montant"
        type="number"
        value={form.montant}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Libellé (optionnel)"
        name="libelle"
        value={form.libelle}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Ajouter
      </Button>
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirmer l'entrée</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Montant: {form.montant} FCFA
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Libellé: {form.libelle || 'Sans libellé'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Date: {new Date().toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FormEntryAdd;
