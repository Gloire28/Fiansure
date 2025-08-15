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
        console.log('Fetching goal with ID:', id);
        const res = await getGoal(id);
        console.log('Goal fetched:', res.data, 'Progression:', res.data.progression);
        setGoal(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching goal:', err.response?.status, err.response?.data);
        setError(err.response?.data?.message || 'Erreur lors de la récupération de l\'objectif');
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const handleEntryAdded = (newGoal) => {
    if (newGoal) {
      console.log('Entry added to goal:', newGoal._id, 'New progression:', newGoal.progression);
      setGoal(newGoal);
    } else {
      console.warn('No newGoal provided to handleEntryAdded');
      getGoal(id).then(res => {
        console.log('Refetched goal after entry:', res.data);
        setGoal(res.data);
      }).catch(err => {
        console.error('Error refetching goal:', err.response?.status, err.response?.data);
        setError('Erreur lors de la mise à jour de l\'objectif');
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <CircularProgress />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            variant="contained" 
            onClick={() => {
              navigate('/goals');
              console.log('Navigated back to goals');
            }} 
            sx={{ mt: 2, bgcolor: '#1976D2', '&:hover': { bgcolor: '#1565C0' } }}
          >
            Retour aux objectifs
          </Button>
        </Box>
      </motion.div>
    );
  }

  if (!goal) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
          <Alert severity="error">Objectif non trouvé</Alert>
          <Button 
            variant="contained" 
            onClick={() => {
              navigate('/goals');
              console.log('Navigated back to goals');
            }} 
            sx={{ mt: 2, bgcolor: '#1976D2', '&:hover': { bgcolor: '#1565C0' } }}
          >
            Retour aux objectifs
          </Button>
        </Box>
      </motion.div>
    );
  }

  const progress = goal.progression || 0;
  const totalEntrees = goal.entrees ? goal.entrees.reduce((sum, entree) => sum + entree.montant, 0) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card sx={{ 
        p: 2, 
        maxWidth: 600, 
        mx: 'auto', 
        borderRadius: 3, 
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        background: `linear-gradient(135deg, ${goal.couleur || '#1976D2'} 0%, #FFFFFF 100%)`
      }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>{goal.nom}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Montant cible: {goal.montantCible} FCFA</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Montant total entré: {totalEntrees.toFixed(2)} FCFA</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Progression: {progress.toFixed(2)}%</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>J-{daysRemaining(goal.dateFin)} avant fin</Typography>
          <FormEntryAdd goalId={goal._id} onSuccess={handleEntryAdded} />
          <HistoryList entrees={goal.entrees} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default GoalDetailPage;