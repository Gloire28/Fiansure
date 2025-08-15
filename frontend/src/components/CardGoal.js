import React from 'react';
import { Card, CardContent, Typography, LinearProgress, IconButton, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag } from 'react-dnd';
import { deleteGoal } from '../services/api';
import { daysRemaining } from '../utils/dateUtils';

function CardGoal({ goal, onDelete }) {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'GOAL',
    item: { id: goal._id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }));

  const handleDelete = async () => {
    if (window.confirm('Supprimer cet objectif ?')) {
      try {
        await deleteGoal(goal._id);
        onDelete(goal._id);
        console.log('Goal deleted:', goal._id);
      } catch (err) {
        console.error('Failed to delete goal:', err);
      }
    }
  };

  const progress = goal.progression || 0;
  const isExpired = new Date(goal.dateFin) < new Date();
  const remainingDays = daysRemaining(goal.dateFin);

  // Dégradé harmonisé pour la barre selon progression
  const getProgressColor = (value) => {
    if (value < 40) return 'linear-gradient(90deg, #F44336, #FF7961)'; // rouge
    if (value < 70) return 'linear-gradient(90deg, #FFC107, #FFD54F)'; // jaune
    return 'linear-gradient(90deg, #4CAF50, #81C784)'; // vert
  };

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        bgcolor: isExpired 
          ? '#FFEBEE' 
          : `linear-gradient(135deg, ${goal.couleur}20, ${goal.couleur}40)`, // dégradé pastel basé sur la couleur choisie
        borderRadius: 3,
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        '&:hover': { 
          boxShadow: '0 10px 28px rgba(0,0,0,0.25)',
          transform: 'scale(1.02)',
        },
        transition: 'all 0.3s',
        width: '100%',
      }}>
        <CardContent onClick={() => navigate(`/goals/${goal._id}`)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Nom de l'objectif */}
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', wordBreak: 'break-word', color: '#212121' }}>
              {goal.nom}
            </Typography>

            {/* Progression */}
            <Typography sx={{ textAlign: 'center', fontWeight: 500 }}>
              Progression: {progress.toFixed(2)}%
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: getProgressColor(progress),
                  transition: 'width 0.5s ease-in-out'
                }
              }} 
            />

            {/* Badge jours restants */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                label={isExpired ? 'Expiré' : `J-${remainingDays} avant fin`} 
                size="small"
                sx={{
                  bgcolor: isExpired ? '#FFCDD2' : `${goal.couleur}80`, // légère transparence pour badge
                  color: isExpired ? '#C62828' : '#212121',
                  fontWeight: 500
                }}
              />
            </Box>

            {/* Bouton supprimer */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CardGoal;
