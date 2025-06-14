import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          ¡Oops! This page is not available.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This page is not longer available
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Go back
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound404;
