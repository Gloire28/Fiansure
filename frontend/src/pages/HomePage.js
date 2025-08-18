import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Alert } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { getGoals, getAccounts, getPendingInvitations, acceptInvitation } from '../services/api';
import CardGoal from '../components/CardGoal';
import CardAccount from '../components/CardAccount';

function HomePage() {
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for HomePage');
        const [goalsRes, accountsRes, invitationsRes] = await Promise.all([
          getGoals(),
          getAccounts(),
          getPendingInvitations()
        ]);
        console.log('Fetched goals:', goalsRes.data);
        console.log('Fetched accounts:', accountsRes.data);
        console.log('Fetched pending invitations:', invitationsRes.data);
        setGoals(goalsRes.data);
        setAccounts(accountsRes.data);
        setPendingInvitations(invitationsRes.data);
      } catch (err) {
        console.error('Error fetching data in HomePage:', err);
        setError('Erreur lors du chargement des données');
      }
    };
    fetchData();
  }, []);

  const handleGoalDelete = (id) => setGoals(goals.filter((g) => g._id !== id));
  const handleAccountDelete = (id) => setAccounts(accounts.filter((a) => a._id !== id));
  const handleAcceptInvitation = async (accountId) => {
    try {
      console.log('Accepting invitation for accountId:', accountId);
      await acceptInvitation(accountId);
      console.log('Invitation accepted, updating state');
      setPendingInvitations(pendingInvitations.filter(inv => inv.accountId !== accountId));
      setError('');
    } catch (err) {
      console.error('Error accepting invitation in HomePage:', err);
      setError('Erreur lors de l\'acceptation de l\'invitation');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            color: '#2c3e50',
          }}
        >
          Tableau de Bord
        </Typography>

        {/* Section des invitations en attente */}
        {pendingInvitations.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 4,
              backgroundColor: 'white',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
              Invitations en attente
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {pendingInvitations.map((inv, index) => (
              <Box key={inv.accountId} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography>Compte : {inv.accountName}</Typography>
                <Typography>Invité par : {inv.invitedBy}</Typography>
                <Typography>Date : {new Date(inv.dateSent).toLocaleDateString()}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1, bgcolor: '#1976D2', '&:hover': { bgcolor: '#1565C0' } }}
                  onClick={() => handleAcceptInvitation(inv.accountId)}
                >
                  Accepter
                </Button>
              </Box>
            ))}
          </Paper>
        )}

        {/* Mes Objectifs */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
            Mes Objectifs
          </Typography>
          {goals.length === 0 && (
            <Typography color="text.secondary">Aucun objectif actif. Créez-en un !</Typography>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {goals.map((goal, index) => (
              <Grid item xs={12} sm={6} md={4} key={goal._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <CardGoal goal={goal} onDelete={handleGoalDelete} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Mes Comptes Actifs */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
            Mes Comptes Actifs
          </Typography>
          {accounts.length === 0 && (
            <Typography color="text.secondary">Aucun compte actif. Créez-en un !</Typography>
          )}
          <Box sx={{ mt: 1 }}>
            {accounts.map((account, index) => (
              <motion.div
                key={account._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Box sx={{ mb: 2 }}>
                  <CardAccount account={account} onDelete={handleAccountDelete} />
                </Box>
              </motion.div>
            ))}
          </Box>
        </Paper>
      </Box>
    </DndProvider>
  );
}

export default HomePage;