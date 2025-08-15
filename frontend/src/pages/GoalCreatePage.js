import React from 'react';
import { Box, Typography } from '@mui/material';
import FormGoalCreate from '../components/FormGoalCreate';
import { useNavigate } from 'react-router-dom';

function GoalCreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    console.log('Goal created successfully');
    navigate('/goals');
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Créer un Nouvel Objectif</Typography>
      <FormGoalCreate onSuccess={handleSuccess} />
    </Box>
  );
}

export default GoalCreatePage;