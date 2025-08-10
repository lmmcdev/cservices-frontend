import React, { memo, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../components/components/fields/loginAzureButton';

const rootSx = {
  width: '100%',
  maxWidth: 500,
  textAlign: 'center',
  p: 4,
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const AuthErrorScreen = ({ errorMessage, onRetry }) => {
  const navigate = useNavigate();

  // Considera "hay error" si viene un string no vacío
  const hasError =
    typeof errorMessage === 'string' && errorMessage.trim().length > 0;

  const handleEnter = useCallback(() => {
    // Solo empuja al dashboard si el usuario ya tiene sesión (tu guard debería manejarlo).
    // Si prefieres reemplazar el historial:
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  return (
    <Box sx={rootSx}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />

      <Typography variant="h5" gutterBottom color="error">
        {hasError ? 'You need to sign in' : 'Ready to continue'}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {hasError
          ? errorMessage
          : "I can't find any error. If you're already signed in, you can enter."}
      </Typography>

      {!hasError ? (
        // SIN error → botón para entrar al dashboard
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={handleEnter}
        >
          Enter dashboard
        </Button>
      ) : (
        // CON error → botón de login Azure (y opcionalmente reintentar)
        <>
          {typeof onRetry === 'function' && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ mb: 2 }}
              onClick={handleRetry}
            >
              Retry
            </Button>
          )}
          <LoginButton />
        </>
      )}
    </Box>
  );
};

export default memo(AuthErrorScreen);
