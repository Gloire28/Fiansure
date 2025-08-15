import React from 'react';
import { Card, CardContent, Typography, LinearProgress, IconButton, Box } from '@mui/material';
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
  console.log('Rendering CardGoal:', goal._id, 'Progression:', progress);
  const isExpired = new Date(goal.dateFin) < new Date();

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        bgcolor: isExpired ? '#FFCDD2' : goal.couleur, 
        mb: 2, 
        borderRadius: 3,
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }
      }}>
        <CardContent onClick={() => {
          navigate(`/goals/${goal._id}`);
          console.log('Navigated to goal:', goal._id);
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>{goal.nom}</Typography>
          <Typography>Progression: {progress.toFixed(2)}%</Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4, 
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #4CAF50, #81C784)'
              }
            }} 
          />
          <Typography>J-{daysRemaining(goal.dateFin)} avant fin</Typography>
          <IconButton onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}>
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CardGoal;
