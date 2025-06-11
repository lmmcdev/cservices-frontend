import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AuthErrorScreen = ({ errorMessage, onRetry }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        textAlign: 'center',
        p: 4,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" gutterBottom color="error">
        Error al iniciar sesión
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {errorMessage || 'Ocurrió un problema al autenticarse. Asegúrate de permitir ventanas emergentes en este sitio.'}
      </Typography>
      <Button variant="contained" color="primary" onClick={onRetry}>
        Reintentar inicio de sesión
      </Button>
    </Box>
  );
};

export default AuthErrorScreen;
