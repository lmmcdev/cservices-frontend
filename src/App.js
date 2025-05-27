// src/App.js
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Topbar />
      <Sidebar />
      <TableTickets />
    </Box>
  );
}

export default App;

