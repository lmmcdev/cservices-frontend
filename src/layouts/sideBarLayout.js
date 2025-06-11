// src/layouts/LayoutWithSidebarOnly.js
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CollapsibleDrawer from '../components/includes/sideBar';

const LayoutWithSidebarOnly = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafd' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <CollapsibleDrawer />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 200px)` }, // Ajusta si usas otro ancho
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutWithSidebarOnly;
