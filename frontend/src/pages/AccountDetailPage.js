import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getAccount } from '../services/api';
import FormMovementAdd from '../components/FormMovementAdd';
import HistoryList from '../components/HistoryList';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function AccountDetailPage() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);

  const fetchAccount = async () => {
    try {
      const res = await getAccount(id);
      setAccount(res.data);
      console.log('Fetched account:', res.data);
    } catch (err) {
      console.error('Error fetching account:', err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [id]);

  if (!account) return <Typography>Chargement...</Typography>;

  const chartData = {
    labels: account.mouvements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Solde',
      data: account.mouvements.reduce((acc, m, i) => {
        acc.push((acc[i-1] || 0) + (m.type === 'entree' ? m.montant : -m.montant));
        return acc;
      }, []),
      borderColor: '#2196F3',
      fill: false
    }]
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">{account.nom}</Typography>
      <Typography sx={{ color: account.solde >= 0 ? '#4CAF50' : '#F44336' }}>
        Solde: {account.solde !== undefined ? account.solde.toFixed(2) : '0.00'} FCFA
      </Typography>
      <Line data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
      <FormMovementAdd
        accountId={id}
        onSuccess={(updatedAccount) => {
          setAccount(updatedAccount);
          console.log('Account updated with new movement:', updatedAccount);
        }}
      />
      <HistoryList items={account.mouvements} />
    </Box>
  );
}

export default AccountDetailPage;
