import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getAccount } from '../services/api';
import FormMovementAdd from '../components/FormMovementAdd';
import HistoryList from '../components/HistoryList';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function AccountDetailPage() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);

  const fetchAccount = async () => {
    try { const res = await getAccount(id); setAccount(res.data); } 
    catch (err) { console.error('Error fetching account:', err); }
  };

  useEffect(() => { fetchAccount(); }, [id]);

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

  return (
    <Box sx={{ p: 2, maxWidth: 700, mx: 'auto', pb: 10 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{account.nom}</Typography>
        <Typography sx={{ color: account.solde >= 0 ? '#4CAF50' : '#F44336', fontWeight: 600, mb: 3 }}>
          Solde: {account.solde !== undefined ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(account.solde) : '0.00'} FCFA
        </Typography>

        <Box sx={{ mb: 4, borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Line data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </Box>

        <FormMovementAdd accountId={id} onSuccess={(updatedAccount) => setAccount(updatedAccount)} />

        {/* Historique flottant qui ne cache pas le bottom nav */}
        <Box sx={{ mt: 4, mb: 6 }}>
          <HistoryList items={account.mouvements} />
        </Box>
      </motion.div>
    </Box>
  );
}

export default AccountDetailPage;
