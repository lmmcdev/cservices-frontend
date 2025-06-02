// src/App.js
import React, { useReducer, useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';
import { LoadingProvider, useLoading } from './components/loadingProvider';
import MsalProviderWrapper from './providers/msalProvider';
import { AuthProvider } from "./utils/authContext";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditTicket from './pages/editTicket';
import { ticketReducer, initialState } from './utils/ticketsReducer';
import { fetchAgentData } from './utils/api';
import './App.css';

function AppContent() {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const [agentsLoaded, setAgentsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadAgents = async () => {
      setLoading(true);
      try {
        await fetchAgentData(dispatch, setLoading);
        if (!cancelled) setAgentsLoaded(true);
      } finally {
        setLoading(false);
      }
    };
    loadAgents();
    return () => {
      cancelled = true;
    };
  }, [setLoading]);

  const { agents } = state;

  if (!agentsLoaded) return null; // o un spinner

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafd', minHeight: '100vh' }}>
      <CssBaseline />
      <Topbar agents={agents} />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TableTickets agents={agents} />} />
        <Route path="/tickets/edit/:ticketId/:agentEmail" element={<EditTicket agents={agents} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <MsalProviderWrapper>
      <AuthProvider>
        <LoadingProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;
