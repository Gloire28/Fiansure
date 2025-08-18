import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import FormGoalCreate from '../components/FormGoalCreate';
import { useNavigate } from 'react-router-dom';

function GoalCreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    console.log('Goal created successfully');
    navigate('/goals');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 500,
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
          animation: 'fadeIn 0.4s ease-in-out',
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.4rem', sm: '1.8rem' },
            color: 'primary.main',
          }}
        >
          🎯 Créer un Nouvel Objectif
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <FormGoalCreate onSuccess={handleSuccess} />
      </Paper>

      {/* Animation CSS simple */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}

export default GoalCreatePage;