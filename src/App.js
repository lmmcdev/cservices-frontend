// src/App.js
import React, { useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';
import EditTicket from './pages/editTicket';
import TableAgents from './pages/tableAgents';
import EditAgent from './pages/editAgent';
import AuthErrorScreen from './components/authErrorScreen';
import UnknownAgentNotice from './components/unknownAgentNotice';

import { LoadingProvider, useLoading } from './components/loadingProvider';
import { fetchAgentData, fetchTableData } from './utils/api';

import { AgentsProvider, useAgents } from './components/components/agentsContext';
import { TicketsProvider, useTickets } from './providers/ticketsContext';
import { SignalRProvider, useSignalR } from './utils/signalRContext';
import { FiltersProvider } from './utils/js/filterContext';
import { AuthProvider, useAuth } from './utils/authContext';
import { useNotification, NotificationProvider } from './providers/notificationsContext';

import MsalProviderWrapper from './providers/msalProvider';

import './App.css';

function AppContent() {
  const { setLoading } = useLoading();
  const { state: agentsState, dispatch: agentDispatch } = useAgents();
  const agents = agentsState.agents;
  const { dispatch: ticketDispatch } = useTickets();
  const { initializeSignalR } = useSignalR();
  const { showNotification } = useNotification();
  const { user, authError, authLoaded, login } = useAuth();

  const [agentEmail, setAgentEmail] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    assignedAgents: [],
    callerIds: [],
  });

  useEffect(() => {
    if (user?.username) setAgentEmail(user.username);
  }, [user]);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const agentsData = await fetchAgentData(agentDispatch, setLoading);
        const ticketsData = await fetchTableData(ticketDispatch, setLoading, user.username);

        if (!isCancelled) {
          agentDispatch({ type: 'SET_AGENTS', payload: agentsData.message });
          //console.log("agentsData.message", agentsData.message);
          ticketDispatch({ type: 'SET_TICKETS', payload: ticketsData.message });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) {
      loadData();
    }

    return () => {
      isCancelled = true;
    };
  }, [setLoading, agentDispatch, ticketDispatch, user?.username]);

  useEffect(() => {
    initializeSignalR();
  }, [initializeSignalR]);

  useEffect(() => {
    initializeSignalR((ticket) => {
      showNotification(`🎫 Nuevo ticket de ${ticket.patient_name || 'Paciente desconocido'}`, 'success');
    });
  }, [initializeSignalR, showNotification]);
  /*useEffect(() => {
    // Puedes habilitar esto cuando integres SignalR:
    initializeSignalR(ticketDispatch);
  }, [initializeSignalR]);*/


  if (!authLoaded) return null;
  if (authError) return <AuthErrorScreen errorMessage={authError} onRetry={login} />;
  if (!user) return null;

  // Validar si el usuario autenticado está en la lista de agentes
  if (!agents || agents.length === 0) return null;

  const knownAgent = agents.find(agent => agent.agent_email === user.username);
  if (!knownAgent) {
    return (
      <UnknownAgentNotice
        userEmail={user.username}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafd', minHeight: '100vh' }}>
      <CssBaseline />
      <Topbar agent={agentEmail} filters={filters} setFilters={setFilters} />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TableTickets filters={filters} />} />
        <Route path="/agents" element={<TableAgents />} />
        <Route path="/tickets/edit/:ticketId" element={<EditTicket />} />
        <Route path="/agent/edit" element={<EditAgent />} />
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
          <TicketsProvider>
          <SignalRProvider>
            <NotificationProvider>
            <FiltersProvider>
              <AgentsProvider>
                
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                
              </AgentsProvider>
            </FiltersProvider>
            </NotificationProvider>
          </SignalRProvider>
          </TicketsProvider>
        </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;