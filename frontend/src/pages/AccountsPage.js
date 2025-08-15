import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getAccounts } from '../services/api';
import { isAccountLimitReached } from '../utils/validationUtils';
import CardAccount from '../components/CardAccount';

function AccountsPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsRes = await getAccounts();
        setAccounts(accountsRes.data);
        console.log('Fetched active accounts:', accountsRes.data.map(a => ({ id: a._id, nom: a.nom, statut: a.statut })));
      } catch (err) {
        console.error('Failed to fetch accounts:', err.response?.status, err.response?.data);
      }
    };
    fetchData();
  }, []);

  const handleAccountDelete = (id) => {
    setAccounts(accounts.filter(a => a._id !== id));
    console.log('Account deleted:', id);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Mes Comptes</Typography>
        {!isAccountLimitReached(accounts) && (
          <Button
            variant="contained"
            onClick={() => {
              navigate('/comptes/new');
              console.log('Navigated to create account');
            }}
            sx={{ m: 2 }}
          >
            Créer un Compte
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => {
            navigate('/comptes/trash');
            console.log('Navigated to accounts trash');
          }}
          sx={{ m: 2 }}
        >
          Corbeille
        </Button>
        {accounts.map(account => (
          <CardAccount key={account._id} account={account} onDelete={handleAccountDelete} />
        ))}
      </Box>
    </DndProvider>
  );
}

export default AccountsPage;