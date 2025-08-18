import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assignUser, changeAssignedUser, getAccount } from '../services/api';

const buttonColors = { bg: '#1976D2', hover: '#1565C0' };
const isValidCustomUserId = (userId) => /^[A-Z]{2}\d{4}$/.test(userId);

function AssignmentForm({ accountId, currentAssignedUserId, onSuccess }) {
  const navigate = useNavigate();
  const [newUserId, setNewUserId] = useState(currentAssignedUserId || '');
  const [confirmUserId, setConfirmUserId] = useState(currentAssignedUserId || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const res = await getAccount(accountId);
        setIsAuthorized(res.data.userId === userId);
      } catch (err) {
        setIsAuthorized(false);
      }
    };
    checkAuthorization();
  }, [accountId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorized) return setError('Vous n\'êtes pas autorisé.');
    if (!newUserId || !confirmUserId) return setError('Veuillez remplir tous les champs');
    if (newUserId !== confirmUserId) return setError('Les ID ne correspondent pas');
    if (!isValidCustomUserId(newUserId)) return setError('Format ID invalide (XX1234)');

    try {
      if (!currentAssignedUserId) {
        await assignUser(accountId, { assignedUserId: newUserId });
        setSuccess('Invitation envoyée. Attendez validation.');
      } else if (newUserId !== currentAssignedUserId) {
        await changeAssignedUser(accountId, { assignedUserId: newUserId });
        setSuccess('Nouvelle invitation envoyée.');
      } else return setError('Aucun changement détecté');

      setError('');
      setTimeout(() => setSuccess(''), 3000);
      onSuccess && onSuccess();
      navigate(`/comptes/${accountId}`);
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'assignation');
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
        disabled={!isAuthorized}
      >
        {isOpen ? 'Cacher le formulaire' : currentAssignedUserId ? 'Changer le gestionnaire' : 'Ajouter un gestionnaire'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <Box sx={formStyle}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <Typography variant="body2">Utilisateur actuel : {currentAssignedUserId || 'Aucun'}</Typography>
              <form onSubmit={handleSubmit}>
                <TextField label="Nouvel ID utilisateur" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} fullWidth sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }} placeholder="Ex. AB1234" disabled={!isAuthorized} />
                <TextField label="Confirmer le nouvel ID" value={confirmUserId} onChange={(e) => setConfirmUserId(e.target.value)} fullWidth sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }} placeholder="Confirmez l'ID" disabled={!isAuthorized} />
                <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: buttonColors.bg, '&:hover': { bgcolor: buttonColors.hover } }} disabled={!isAuthorized}>
                  {currentAssignedUserId ? 'Confirmer le changement' : 'Ajouter le gestionnaire'}
                </Button>
              </form>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default AssignmentForm;
