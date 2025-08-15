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
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    try {
      const res = await addEntry(goalId, form);
      onSuccess(res.data);
      setForm({ montant: '', libelle: '' });
      setError('');
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
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
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Montant (FCFA)"
        name="montant"
        type="number"
        value={form.montant}
        onChange={handleChange}
        fullWidth
        required
        sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}
      />
      <TextField
        label="Libellé (optionnel)"
        name="libelle"
        value={form.libelle}
        onChange={handleChange}
        fullWidth
        sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 1, bgcolor: '#1976D2', '&:hover': { bgcolor: '#1565C0' } }}>
        Ajouter
      </Button>

      <Dialog open={openDialog} onClose={handleCancel} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Confirmer l'entrée</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>Montant: {form.montant} FCFA</Typography>
          <Typography>Libellé: {form.libelle || 'Sans libellé'}</Typography>
          <Typography>Date: {new Date().toLocaleDateString()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">Annuler</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">Confirmer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FormEntryAdd;
