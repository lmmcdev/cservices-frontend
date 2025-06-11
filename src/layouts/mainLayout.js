import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Topbar from '../components/includes/topBar';
import Sidebar from '../components/includes/sideBar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ agentEmail, filters, setFilters }) => (
  <Box sx={{ display: 'flex', bgcolor: '#f8fafd', minHeight: '100vh' }}>
    <CssBaseline />
    <Topbar agent={agentEmail} filters={filters} setFilters={setFilters} />
    <Sidebar />
    <Outlet /> {/* Aquí se renderizan las páginas */}
  </Box>
);

export default MainLayout;
