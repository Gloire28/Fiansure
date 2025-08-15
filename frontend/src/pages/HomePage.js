import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getGoals, getAccounts } from '../services/api';
import CardGoal from '../components/CardGoal';
import CardAccount from '../components/CardAccount';

function HomePage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goalsRes = await getGoals();
        const accountsRes = await getAccounts();
        setGoals(goalsRes.data);
        setAccounts(accountsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleGoalDelete = (id) => setGoals(goals.filter(g => g._id !== id));
  const handleAccountDelete = (id) => setAccounts(accounts.filter(a => a._id !== id));

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Tableau de Bord</Typography>
        <Button variant="contained" onClick={() => navigate('/goals')} sx={{ m: 2 }}>
          Mes Objectifs
        </Button>
        <Button variant="contained" onClick={() => navigate('/comptes')} sx={{ m: 2 }}>
          Mes Comptes
        </Button>
        <Typography variant="h5">Objectifs Actifs</Typography>
        {goals.length === 0 && <Typography>Aucun objectif actif. Créez-en un !</Typography>}
        {goals.map(goal => (
          <CardGoal key={goal._id} goal={goal} onDelete={handleGoalDelete} />
        ))}
        <Typography variant="h5">Comptes Actifs</Typography>
        {accounts.length === 0 && <Typography>Aucun compte actif. Créez-en un !</Typography>}
        {accounts.map(account => (
          <CardAccount key={account._id} account={account} onDelete={handleAccountDelete} />
        ))}
      </Box>
    </DndProvider>
  );
}

export default HomePage;