import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import AccountCreateForm from '../components/AccountCreateForm';
import { useNavigate } from 'react-router-dom';

function AccountCreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/comptes');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <AccountCreateForm onSuccess={handleSuccess} />
      </motion.div>
    </Box>
  );
}

export default AccountCreatePage;