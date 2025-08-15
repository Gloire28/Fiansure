import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography } from '@mui/material';
import { createGoal } from '../services/api';
import { isDateNotFuture, isEndDateValid } from '../utils/dateUtils';
import { libelles } from '../utils/validationUtils';

function FormGoalCreate({ onSuccess }) {
  const [form, setForm] = useState({
    nom: '',
    montantCible: '',
    dateDebut: '',
    dateFin: '',
    couleur: '#4CAF50'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDateNotFuture(form.dateDebut)) {
      setError('Date de début non future');
      return;
    }
    if (!isEndDateValid(form.dateDebut, form.dateFin)) {
      setError('Date de fin invalide');
      return;
    }
    
    try {
      await createGoal(form);
      onSuccess();
      setForm({ nom: '', montantCible: '', dateDebut: '', dateFin: '', couleur: '#4CAF50' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Créer un objectif</Typography>
      <TextField
        label="Nom de l'objectif"
        name="nom"
        value={form.nom}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Montant cible (FCFA)"
        name="montantCible"
        type="number"
        value={form.montantCible}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Date de début"
        name="dateDebut"
        type="date"
        value={form.dateDebut}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
        sx={{
          '& input[type="date"]': {
            color: 'inherit', // Assure que la date sélectionnée est visible
          },
          '& input[type="date"]::-webkit-datetime-edit': {
            color: 'inherit', // Affiche les champs de date (jour, mois, année)
          },
          '& input[type="date"]::-webkit-datetime-edit-text': {
            color: 'transparent', // Masque uniquement les séparateurs (/)
          },
        }}
      />
      <TextField
        label="Date de fin"
        name="dateFin"
        type="date"
        value={form.dateFin}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
        sx={{
          '& input[type="date"]': {
            color: 'inherit', // Assure que la date sélectionnée est visible
          },
          '& input[type="date"]::-webkit-datetime-edit': {
            color: 'inherit', // Affiche les champs de date (jour, mois, année)
          },
          '& input[type="date"]::-webkit-datetime-edit-text': {
            color: 'transparent', // Masque uniquement les séparateurs (/)
          },
        }}
      />
      <TextField
        label="Couleur"
        name="couleur"
        type="color"
        value={form.couleur}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Créer</Button>
    </Box>
  );
}

export default FormGoalCreate;
