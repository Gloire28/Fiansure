import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getGoals } from '../services/api';
import ExpiredGoals from '../components/ExpiredGoals';

function GoalsExpiredPage() {
  const [expiredGoals, setExpiredGoals] = useState([]);

  useEffect(() => {
    const fetchExpiredGoals = async () => {
      try {
        const res = await getGoals();
        const expired = res.data.filter(g => new Date(g.dateFin) < new Date());
        setExpiredGoals(expired);
        console.log('Fetched expired goals:', expired);
      } catch (err) {
        console.error('Failed to fetch expired goals:', err);
      }
    };
    fetchExpiredGoals();
  }, []);

  const handleUpdate = () => {
    fetchExpiredGoals();
    console.log('Expired goals updated');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Objectifs Expirés</Typography>
      <ExpiredGoals goals={expiredGoals} onUpdate={handleUpdate} />
    </Box>
  );
}

export default GoalsExpiredPage;