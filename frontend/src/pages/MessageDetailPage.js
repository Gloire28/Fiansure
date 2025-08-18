import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { getAccount, markAsRead } from '../services/api';

function MessageDetailPage() {
  const { accountId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const res = await getAccount(accountId);
        setAccountName(res.data.nom);
        setError(null);
      } catch (err) {
        console.error('Error fetching account:', err);
        setError('Erreur lors du chargement du compte');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [accountId]);

  if (loading) return (
    <Box sx={{ p: 2, pt: 10, pb: 10, textAlign: 'center' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 2, pt: 10, pb: 10, textAlign: 'center' }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 2, pt: 10, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Discussion - Compte {accountName || accountId}</Typography>
      <MessageBox accountId={accountId} />
    </Box>
  );
}

export default MessageDetailPage;