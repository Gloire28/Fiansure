import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getGoals } from '../services/api';
import { isGoalLimitReached } from '../utils/validationUtils';
import CardGoal from '../components/CardGoal';

function GoalsPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goalsRes = await getGoals();
        setGoals(goalsRes.data);
        console.log('Fetched active goals:', goalsRes.data);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      }
    };
    fetchData();
  }, []);

  const handleGoalDelete = (id) => {
    setGoals(goals.filter(g => g._id !== id));
    console.log('Goal deleted:', id);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Mes Objectifs</Typography>
        {!isGoalLimitReached(goals) && (
          <Button variant="contained" onClick={() => {
            navigate('/goals/new');
            console.log('Navigated to create goal');
          }} sx={{ m: 2 }}>
            Créer un Objectif
          </Button>
        )}
        <Button variant="contained" onClick={() => {
          navigate('/goals/trash');
          console.log('Navigated to goals trash');
        }} sx={{ m: 2 }}>
          Corbeille
        </Button>
        <Button variant="contained" onClick={() => {
          navigate('/goals/expired');
          console.log('Navigated to expired goals');
        }} sx={{ m: 2 }}>
          Objectifs Expirés
        </Button>
        {goals.map(goal => (
          <CardGoal key={goal._id} goal={goal} onDelete={handleGoalDelete} />
        ))}
      </Box>
    </DndProvider>
  );
}

export default GoalsPage;