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
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../services/api';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function AccountCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', solde: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAccount(form);
      setForm({ nom: '', solde: '' });
      setError('');
      navigate('/comptes');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
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
        background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
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
          {/* Header avec icône */}
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 50, color: '#1976D2' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976D2' }}>
              Créer un Compte
            </Typography>
          </Stack>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginBottom: '16px' }}
            >
              <Alert severity="error">{error}</Alert>
            </motion.div>
          )}

          {/* Formulaire */}
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
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2
                }}
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
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2
                }}
              />
            </motion.div>

            {/* Boutons */}
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
                  onClick={() => navigate('/comptes')}
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
      </motion.div>
    </Box>
  );
}

export default AccountCreatePage;
