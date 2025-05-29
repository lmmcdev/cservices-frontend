// src/App.js
//import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';
import { LoadingProvider } from './components/loadingProvider';
import MsalProviderWrapper from './providers/msalProvider';
import { AuthProvider } from "./utils/authContext";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditTicket from './pages/editTicket';
import './App.css'

function App() {

  return (
    <MsalProviderWrapper>
      <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
        <Box sx={{ display: 'flex', bgcolor: '#f8fafd', minHeight: '100vh' }}>
          <CssBaseline />
          <Topbar />
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<TableTickets />} />
            <Route path="/tickets/edit/:ticketId/:agentEmail" element={<EditTicket />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
        </BrowserRouter>
      </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;