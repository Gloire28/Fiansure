import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getCorbeilleGoals, restoreGoal } from '../services/api';
import Corbeille from '../components/Corbeille';

function GoalsTrashPage() {
  const [corbeille, setCorbeille] = useState([]);

  useEffect(() => {
    const fetchCorbeille = async () => {
      try {
        const res = await getCorbeilleGoals();
        setCorbeille(res.data);
        console.log('Fetched deleted goals:', res.data);
      } catch (err) {
        console.error('Failed to fetch deleted goals:', err);
      }
    };
    fetchCorbeille();
  }, []);

  const handleRestore = async (id) => {
    try {
      await restoreGoal(id);
      setCorbeille(corbeille.filter(g => g._id !== id));
      console.log('Goal restored:', id);
    } catch (err) {
      console.error('Failed to restore goal:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Corbeille des Objectifs</Typography>
      <Corbeille items={corbeille} onRestore={handleRestore} isGoal={true} />
    </Box>
  );
}

export default GoalsTrashPage;