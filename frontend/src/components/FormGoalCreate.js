import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Stack,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { createGoal } from '../services/api';
import { isDateNotFuture, isEndDateValid } from '../utils/dateUtils';

function FormGoalCreate({ onSuccess }) {
  const [form, setForm] = useState({
    nom: '',
    montantCible: '',
    dateDebut: '',
    dateFin: '',
    couleur: '#4CAF50'
  });
  const [error, setError] = useState('');
  
  // Pallette de couleurs prédéfinies
  const colorPalette = [
    '#4CAF50', // Vert
    '#2196F3', // Bleu
    '#FF9800', // Orange
    '#E91E63', // Rose
    '#9C27B0', // Violet
    '#00BCD4', // Cyan
    '#FF5722', // Rouge-orange
    '#607D8B'  // Gris-bleu
  ];

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

  const handleColorChange = (e, newColor) => {
    if (newColor) {
      setForm({ ...form, couleur: newColor });
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
        animation: 'fadeIn 0.4s ease-in-out'
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: 'center', color: 'primary.main' }}
      >
        🎯 
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nom de l'objectif"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Montant cible (FCFA)"
            name="montantCible"
            type="number"
            value={form.montantCible}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Date de début"
            name="dateDebut"
            type="date"
            value={form.dateDebut}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& input[type="date"]::-webkit-datetime-edit': {
                color: 'rgba(0,0,0, 0.6)'
              }
            }}
          />
          <TextField
            label="Date de fin"
            name="dateFin"
            type="date"
            value={form.dateFin}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& input[type="date"]::-webkit-datetime-edit': {
                color: 'rgba(0,0,0, 0.6)'
              }
            }}
          />
          
          {/* Nouveau sélecteur de couleur */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 500 }}>
              Couleur de l'objectif
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ToggleButtonGroup
                value={form.couleur}
                exclusive
                onChange={handleColorChange}
                sx={{ flexGrow: 1 }}
              >
                {colorPalette.map((color) => (
                  <ToggleButton
                    key={color}
                    value={color}
                    sx={{
                      width: 32,
                      height: 32,
                      minWidth: 32,
                      p: 0,
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: form.couleur === color 
                        ? '2px solid #000' 
                        : '1px solid rgba(0,0,0,0.1)',
                      '&:hover': { 
                        opacity: 0.9,
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </ToggleButtonGroup>
              
              {/* Sélecteur personnalisé */}
              <Box sx={{ 
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <TextField
                  type="color"
                  name="couleur"
                  value={form.couleur}
                  onChange={handleChange}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    width: 56,
                    height: 56,
                    cursor: 'pointer',
                    '& input': { 
                      padding: 0, 
                      height: '100%',
                      cursor: 'pointer'
                    }
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Cliquez sur une pastille ou choisissez une couleur personnalisée
            </Typography>
          </Box>

          {error && (
            <Typography color="error" textAlign="center" fontSize="0.9rem">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              fontWeight: 'bold',
              borderRadius: '30px',
              textTransform: 'none',
              background: `linear-gradient(45deg, ${form.couleur} 30%, #21CBF3 90%)`,
              boxShadow: `0 3px 5px 2px rgba(${parseInt(form.couleur.slice(1, 3), 16)}, ${parseInt(form.couleur.slice(3, 5), 16)}, ${parseInt(form.couleur.slice(5, 7), 16)}, 0.3)`,
              '&:hover': {
                boxShadow: `0 5px 8px 3px rgba(${parseInt(form.couleur.slice(1, 3), 16)}, ${parseInt(form.couleur.slice(3, 5), 16)}, ${parseInt(form.couleur.slice(5, 7), 16)}, 0.4)`,
              }
            }}
          >
            Créer l'objectif
          </Button>
        </Stack>
      </Box>

      {/* Animation CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Paper>
  );
}

export default FormGoalCreate;