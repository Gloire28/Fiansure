import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag } from 'react-dnd';
import { Line } from 'react-chartjs-2';
import { deleteAccount } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function CardAccount({ account, onDelete }) {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ACCOUNT',
    item: { id: account._id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }));

  const handleDelete = async () => {
    if (window.confirm('Supprimer ce compte ?')) {
      try {
        await deleteAccount(account._id);
        onDelete(account._id);
        console.log('Account deleted:', account._id);
      } catch (err) {
        console.error('Failed to delete account:', err);
      }
    }
  };

  const chartData = {
    labels: account.mouvements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Solde',
      data: account.mouvements.reduce((acc, m, i) => {
        acc.push((acc[i-1] || 0) + (m.type === 'entree' ? m.montant : -m.montant));
        return acc;
      }, []),
      borderColor: '#1976D2',
      backgroundColor: 'rgba(25, 118, 210, 0.2)',
      fill: true
    }]
  };

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        mb: 2, 
        borderRadius: 3,
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }
      }}>
        <CardContent onClick={() => {
          navigate(`/comptes/${account._id}`);
          console.log('Navigated to account:', account._id);
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>{account.nom}</Typography>
          <Typography sx={{ color: account.solde >= 0 ? '#4CAF50' : '#F44336' }}>
            Solde: {account.solde !== undefined ? account.solde.toFixed(2) : '0.00'} FCFA
          </Typography>
          <Line 
            data={chartData} 
            options={{ 
              scales: { y: { beginAtZero: true } },
              plugins: { legend: { display: false } }
            }} 
          />
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CardAccount;