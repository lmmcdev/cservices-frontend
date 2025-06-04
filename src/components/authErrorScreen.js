// src/components/AuthErrorScreen.js
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AuthErrorScreen = ({ errorMessage, onRetry }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          textAlign: 'center',
          p: 4,
          borderRadius: 3,
          bgcolor: 'white',
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom color="error">
          Error al iniciar sesión
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {errorMessage || 'Ocurrió un problema al autenticarse. Asegúrate de permitir ventanas emergentes en este sitio.'}
        </Typography>
        <Button variant="contained" color="primary" onClick={onRetry}>
          Reintentar inicio de sesión
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthErrorScreen;
