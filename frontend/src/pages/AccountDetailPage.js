import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getAccount, getAccountHistory } from '../services/api';
import FormMovementAdd from '../components/FormMovementAdd';
import HistoryList from '../components/HistoryList';
import AssignmentForm from '../components/AssignmentForm';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

function AccountDetailPage() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState({ mouvements: [], solde: 0 });
  const userId = localStorage.getItem('userId');

  const fetchAccount = async () => {
    try {
      const res = await getAccount(id);
      setAccount(res.data);
    } catch (err) {
      console.error('Error fetching account:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getAccountHistory(id);
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchHistory();
  }, [id]);

  if (!account) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Chargement...</Typography>;

  const chartData = {
    labels: account.mouvements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Solde',
      data: account.mouvements.reduce((acc, m, i) => {
        acc.push((acc[i-1] || 0) + (m.type === 'entree' ? m.montant : -m.montant));
        return acc;
      }, []),
      borderColor: '#2196F3',
      fill: true,
      backgroundColor: 'rgba(33,150,243,0.1)',
      tension: 0.3
    }]
  };

  const isAssigned = account.assignedUserId === userId;
  const isCreator = account.userId === userId;

  const handleAssignmentSuccess = () => fetchAccount();

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', pb: 10 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{account.nom}</Typography>
        <Typography sx={{ color: account.solde >= 0 ? '#4CAF50' : '#F44336', fontWeight: 600, mb: 3 }}>
          Solde: {account.solde !== undefined ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(account.solde) : '0'} FCFA
        </Typography>

        {/* Graphique */}
        <Box sx={{ mb: 4, borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Line data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </Box>

        {/* Blocs alignés horizontalement sur grand écran */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          {/* Formulaire de mouvement */}
          <Box sx={{ flex: 1 }}>
            <FormMovementAdd
              accountId={id}
              onSuccess={(updatedAccount) => setAccount(updatedAccount)}
              buttonColor="#4CAF50"
            />
          </Box>

          {/* Historique */}
          <Box sx={{ flex: 1 }}>
            <HistoryList items={isAssigned ? history.movements : account.mouvements} />
          </Box>

          {/* Formulaire d'assignation (visible seulement pour le créateur) */}
          {isCreator && (
            <Box sx={{ flex: 1 }}>
              <AssignmentForm
                accountId={id}
                currentAssignedUserId={account.assignedUserId}
                onSuccess={handleAssignmentSuccess}
                buttonColor="#1976D2"
              />
            </Box>
          )}
        </Stack>

        {/* Message d'alerte si pas autorisé */}
        {!isCreator && (
          <Alert severity="warning" sx={{ mt: 4 }}>
            {userId ? 'Seul le créateur peut gérer les assignations.' : 'Vous devez être connecté pour gérer les assignations.'}
          </Alert>
        )}
      </motion.div>
    </Box>
  );
}

export default AccountDetailPage;
