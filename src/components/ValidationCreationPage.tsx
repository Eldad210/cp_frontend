import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { Chat } from './Chat';
import { useAuthStore } from '../store/authStore';


import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Snackbar, Alert, Button } from '@mui/material';

export const ValidationCreationPage = () => {
  const navigate = useNavigate();
   const { user, logout } = useAuthStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader user={user} onLogout={logout} />


      <Chat />
      <Box sx={{ py: 2, px: 2, bgcolor: 'grey.200', textAlign: 'start', position: 'fixed', bottom: 0, width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </Button>
       
      </Box>
    </Box>
  );
};