// src/App.js
//import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';
import { LoadingProvider } from './components/loadingProvider';
import MsalProviderWrapper from './providers/msalProvider';
import { AuthProvider } from "./utils/authContext";
import './App.css'

function App() {

  return (
    <MsalProviderWrapper>
      <AuthProvider>
      <LoadingProvider>
        <Box sx={{ display: 'flex', bgcolor: '#f8fafd', minHeight: '100vh' }}>
          <CssBaseline />
          <Topbar />
          <Sidebar />
          <TableTickets />
        </Box>
      </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;