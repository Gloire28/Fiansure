import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getGoals } from '../services/api';
import { isGoalLimitReached } from '../utils/validationUtils';
import CardGoal from '../components/CardGoal';
import { Add as AddIcon, Delete as DeleteIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';

function GoalsPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goalsRes = await getGoals();
        setGoals(goalsRes.data);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      }
    };
    fetchData();
  }, []);

  const handleGoalDelete = (id) => {
    setGoals(goals.filter(g => g._id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        {/* Titre */}
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Mes Objectifs
        </Typography>

        {/* Boutons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            mb: 4,
            justifyContent: 'center', 
            alignItems: 'stretch',
            flexWrap: 'nowrap', 
            overflowX: { xs: 'auto', md: 'visible' }, // scroll horizontal si écran très petit
            pb: 1
          }}
        >
          {!isGoalLimitReached(goals) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/goals/new')}
              sx={{
                bgcolor: '#2196F3', // même bleu que "Créer un Compte"
                '&:hover': { bgcolor: '#1976D2' },
                borderRadius: '30px',
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Créer un Objectif
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => navigate('/goals/trash')}
            sx={{
              bgcolor: '#F44336',
              '&:hover': { bgcolor: '#D32F2F' },
              borderRadius: '30px',
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            Corbeille
          </Button>
          <Button
            variant="contained"
            startIcon={<AccessTimeIcon />}
            onClick={() => navigate('/goals/expired')}
            sx={{
              bgcolor: '#FF9800',
              '&:hover': { bgcolor: '#F57C00' },
              borderRadius: '30px',
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            Objectifs Expirés
          </Button>
        </Stack>

        {/* Cartes en grille */}
        <Grid container spacing={3}>
          {goals.map(goal => (
            <Grid item xs={12} sm={6} md={4} key={goal._id}>
              <CardGoal goal={goal} onDelete={handleGoalDelete} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </DndProvider>
  );
}

export default GoalsPage;
