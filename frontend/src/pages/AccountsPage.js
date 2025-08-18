import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
        // Plus besoin de filtrer ici, le backend gère l'authentification avec userId
        setAccounts(accountsRes.data);
      } catch (err) {
        console.error('Failed to fetch accounts:', err.response?.status, err.response?.data);
      }
    };
    fetchData();
  }, []);

  const handleAccountDelete = (id) => {
    setAccounts(accounts.filter(a => a._id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Mes Comptes
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {!isAccountLimitReached(accounts) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/comptes/new')}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#43A047' },
                borderRadius: '30px',
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none'
              }}
            >
              Créer un Compte
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => navigate('/comptes/trash')}
            sx={{
              bgcolor: '#F44336',
              '&:hover': { bgcolor: '#E53935' },
              borderRadius: '30px',
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            Corbeille
          </Button>
        </Stack>

        {accounts.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            Aucun compte disponible.
          </Typography>
        ) : (
          accounts.map(account => (
            <CardAccount 
              key={account._id} 
              account={account} 
              onDelete={handleAccountDelete}
              showMessages={account.assignedUserId === localStorage.getItem('userId')} // Utiliser userId au lieu de userObjectId
            />
          ))
        )}
      </Box>
    </DndProvider>
  );
}

export default AccountsPage;