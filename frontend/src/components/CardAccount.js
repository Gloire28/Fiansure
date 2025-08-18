import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageIcon from '@mui/icons-material/Message';
import { useDrag } from 'react-dnd';
import { Line } from 'react-chartjs-2';
import { deleteAccount } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function CardAccount({ account, onDelete, showMessages }) {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ACCOUNT',
    item: { id: account._id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }));

  const handleDelete = async (e) => {
    e.stopPropagation();
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

  const totalBalance = account.solde ?? 0;
  const balancePercent = Math.min(Math.max((totalBalance / 100000) * 100, 0), 100);

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
        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
        width: '100%',
      }}>
        <CardContent onClick={() => navigate(`/comptes/${account._id}`)}>
          <Box sx={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
            {/* Gauche : Box moderne responsive */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              minWidth: 120,
              maxWidth: 220,
              flexShrink: 0,
              borderRadius: 3,
              bgcolor: 'linear-gradient(135deg, rgba(25,118,210,0.1), rgba(25,118,210,0.2))',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', wordBreak: 'break-word', mb: 1 }}>
                {account.nom}
              </Typography>
              <Typography sx={{ 
                color: totalBalance >= 0 ? '#4CAF50' : '#F44336', 
                fontWeight: 500,
                textAlign: 'center', 
                fontSize: '1.1rem',
                mb: 1
              }}>
                {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(totalBalance)} FCFA
              </Typography>
              {/* Mini-indicateur visuel */}
              <Box sx={{ width: '100%' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={balancePercent} 
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: totalBalance >= 0 ? '#4CAF50' : '#F44336'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Droite : Graphique */}
            <Box sx={{ 
              flexGrow: 1, 
              p: 2,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Line 
                data={chartData} 
                options={{ 
                  scales: { y: { beginAtZero: true } },
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  height: 150
                }} 
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            {showMessages && (
              <IconButton onClick={() => navigate(`/comptes/${account._id}/messages`)}>
                <MessageIcon color="primary" />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CardAccount;
