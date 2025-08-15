import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoal } from '../services/api';
import FormEntryAdd from '../components/FormEntryAdd';
import HistoryList from '../components/HistoryList';
import { daysRemaining } from '../utils/dateUtils';

function GoalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await getGoal(id);
        setGoal(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la récupération de l\'objectif');
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const handleEntryAdded = (newGoal) => {
    if (newGoal) setGoal(newGoal);
    else {
      getGoal(id).then(res => setGoal(res.data)).catch(() => setError('Erreur lors de la mise à jour'));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <CircularProgress />
        </motion.div>
      </Box>
    );
  }

  if (error || !goal) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
          <Alert severity="error">{error || 'Objectif non trouvé'}</Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/goals')} 
            sx={{ mt: 2, bgcolor: '#1976D2', '&:hover': { bgcolor: '#1565C0' } }}
          >
            Retour aux objectifs
          </Button>
        </Box>
      </motion.div>
    );
  }

  const progress = goal.progression || 0;
  const totalEntrees = goal.entrees ? goal.entrees.reduce((sum, e) => sum + e.montant, 0) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card sx={{ 
        p: 3, 
        maxWidth: 650, 
        mx: 'auto', 
        borderRadius: 4, 
        boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
        background: `linear-gradient(135deg, ${goal.couleur}20, ${goal.couleur}40)`,
        transition: 'transform 0.3s',
        '&:hover': { transform: 'scale(1.01)' }
      }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', color: '#212121' }}>{goal.nom}</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Montant cible: {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(goal.montantCible)} FCFA</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Total entré: {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(totalEntrees)} FCFA</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Progression: {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(progress)}%</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>J-{daysRemaining(goal.dateFin)} avant fin</Typography>
          </Box>

          <FormEntryAdd goalId={goal._id} onSuccess={handleEntryAdded} />
          <HistoryList entrees={goal.entrees} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default GoalDetailPage;
