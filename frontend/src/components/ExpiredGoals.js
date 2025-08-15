import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { updateGoalDate } from '../services/api';
import HistoryList from './HistoryList';

function ExpiredGoals({ goals, onUpdate }) {
  const [dateFin, setDateFin] = useState('');

  const handleUpdate = async (id) => {
    try {
      await updateGoalDate(id, { dateFin });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {goals.map(goal => (
        <Card key={goal._id} sx={{ mb: 2, bgcolor: '#FFCDD2' }}>
          <CardContent>
            <Typography variant="h6">{goal.nom}</Typography>
            <Typography>Progression: {goal.progression.toFixed(2)}%</Typography>
            <HistoryList items={goal.entrees} />
            <TextField
              label="Nouvelle date de fin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={() => handleUpdate(goal._id)} variant="contained">
              Mettre à jour
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default ExpiredGoals;