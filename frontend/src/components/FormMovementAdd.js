import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { addMovement, getAccount, sendMessage } from '../services/api'; // Ajout de sendMessage

const buttonColors = { bg: '#4CAF50', hover: '#388E3C' };

function FormMovementAdd({ accountId, onSuccess }) {
  const [form, setForm] = useState({ montant: '', libelle: '', type: 'entree' });
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState({});
  const userId = localStorage.getItem('userId'); // Récupération de l'ID utilisateur

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await getAccount(accountId);
        setAccount(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccount();
  }, [accountId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoyer le mouvement
      const res = await addMovement(accountId, form);
      
      // Réinitialiser le formulaire
      setForm({ montant: '', libelle: '', type: 'entree' });
      setError('');
      
      // Appeler le callback de succès
      onSuccess && onSuccess(res.data);
      
      // Envoyer la notification à l'autre utilisateur
      const receiverId = account.assignedUserId && account.assignedUserId.toString() !== userId 
        ? account.assignedUserId 
        : account.userId;
      
      if (receiverId && receiverId !== userId) {
        await sendMessage({
          receiverId,
          accountId,
          content: `Nouveau mouvement ajouté : ${form.libelle} (${form.type === 'entree' ? '+' : '-'}${form.montant} FCFA)`
        });
      }

      // Fermer le formulaire
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du mouvement');
    }
  };

  const formStyle = {
    p: 3,
    borderRadius: 3,
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    bgcolor: '#F5F7FA',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    width: '100%',
    maxWidth: 650,
    mx: 'auto',
    mb: 3,
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Button
        variant="contained"
        onClick={() => setIsOpen(!isOpen)}
        sx={{ mb: 2, bgcolor: buttonColors.bg, '&:hover': { bgcolor: buttonColors.hover } }}
      >
        {isOpen ? 'Cacher le formulaire' : 'Ajouter un Mouvement'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
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
                inputProps={{ min: "0.01", step: "0.01" }}
              />
              
              <TextField
                label="Libellé"
                name="libelle"
                value={form.libelle}
                onChange={handleChange}
                fullWidth
                sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
                required
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
              
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ 
                  mt: 2, 
                  bgcolor: buttonColors.bg, 
                  '&:hover': { bgcolor: buttonColors.hover },
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                Ajouter le mouvement
              </Button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default FormMovementAdd;