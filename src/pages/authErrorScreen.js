import React, {useEffect} from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import LoginButton from '../components/components/fields/loginAzureButton';

const AuthErrorScreen = ({ errorMessage, onRetry }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /*useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);*/
  
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
        You need to sign in
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {errorMessage || 'There is a problem in your end, please check if your browser allows popups.'}
      </Typography>
      
      <Button variant="contained" color="primary" sx={{mb: 5}} onClick={() => navigate('/dashboard', { replace: true })}>
        Try to re-enter
      </Button>
      <LoginButton />
      
    </Box>
  );
};

export default AuthErrorScreen;
