import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { createAccount } from '../services/api';

function AccountCreateForm({ onSuccess }) {
  const [form, setForm] = useState({ nom: '', solde: '', assignedUserId: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedForm = {
        ...form,
        userId: localStorage.getItem('userId') // Ajout de l'ID de l'utilisateur connecté
      };
      // Validation du assignedUserId
      if (cleanedForm.assignedUserId && !/^[A-Z]{2}\d{4}$/.test(cleanedForm.assignedUserId)) {
        setError('L\'ID de l\'utilisateur assigné doit être au format AB1234 (ex. NA1234)');
        return;
      }
      if (!cleanedForm.assignedUserId) {
        delete cleanedForm.assignedUserId; // Supprimer si vide
      }
      const res = await createAccount(cleanedForm);
      setForm({ nom: '', solde: '', assignedUserId: '' });
      setError('');
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du compte';
      setError(errorMessage === 'Limite de 10 comptes actifs atteinte' 
        ? 'Vous avez atteint la limite de 10 comptes actifs.' 
        : errorMessage);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
      }}
    >
      <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <AccountBalanceWalletIcon sx={{ fontSize: 50, color: '#1976D2' }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976D2' }}>
          Créer un Compte
        </Typography>
      </Stack>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: '16px' }}
        >
          <Alert severity="error">{error}</Alert>
        </motion.div>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TextField
            label="Nom du compte"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TextField
            label="Solde initial (FCFA)"
            name="solde"
            type="number"
            value={form.solde}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TextField
            label="ID de l'utilisateur assigné (optionnel)"
            name="assignedUserId"
            value={form.assignedUserId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ bgcolor: 'white', borderRadius: 2 }}
            placeholder="Ex. NA1234"
            helperText="Format attendu : 2 lettres suivies de 4 chiffres (ex. NA1234)"
          />
        </motion.div>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#4CAF50',
                px: 3,
                borderRadius: 3,
                '&:hover': { bgcolor: '#388E3C' }
              }}
            >
              Créer
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outlined"
              onClick={() => onSuccess && onSuccess()}
              sx={{
                color: '#1976D2',
                borderColor: '#1976D2',
                px: 3,
                borderRadius: 3,
                '&:hover': { borderColor: '#1565C0', color: '#1565C0' }
              }}
            >
              Annuler
            </Button>
          </motion.div>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AccountCreateForm;