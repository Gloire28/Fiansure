import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCorbeilleAccounts, restoreAccount } from '../services/api';
import Corbeille from '../components/Corbeille';

function AccountsTrashPage() {
  const [corbeille, setCorbeille] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorbeille = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, redirecting to login');
          navigate('/login');
          return;
        }
        console.log('Token for getCorbeilleAccounts:', token);
        const res = await getCorbeilleAccounts();
        console.log('Raw response from getCorbeilleAccounts:', res);
        setCorbeille(res.data || []);
        console.log('Fetched deleted accounts:', res.data?.map(a => ({ id: a._id, nom: a.nom, statut: a.statut })) || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch deleted accounts:', err.response?.status, err.response?.data);
        setError(err.response?.data?.message || 'Erreur lors de la récupération des comptes');
        setCorbeille([]);
        if (err.response?.status === 401) {
          console.error('Unauthorized, redirecting to login');
          navigate('/login');
        }
      }
    };
    fetchCorbeille();
  }, [navigate]);

  const handleRestore = async (id) => {
    try {
      await restoreAccount(id);
      setCorbeille(corbeille.filter(a => a._id !== id));
      console.log('Account restored:', id);
    } catch (err) {
      console.error('Failed to restore account:', err.response?.status, err.response?.data);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Corbeille des Comptes</Typography>
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {corbeille.length === 0 && !error && (
        <Typography variant="body1" color="textSecondary">
          Aucun compte dans la corbeille.
        </Typography>
      )}
      {corbeille.length > 0 && (
        <Corbeille items={corbeille} onRestore={handleRestore} isGoal={false} />
      )}
    </Box>
  );
}

export default AccountsTrashPage;