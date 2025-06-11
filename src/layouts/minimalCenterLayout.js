import React from 'react';
import { Box, CssBaseline, Container, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

const MinimalCenteredLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default MinimalCenteredLayout;

