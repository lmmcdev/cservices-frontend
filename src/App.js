// src/App.js
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TableTickets from './pages/tableTickets';
import EditTicket from './pages/editTicket';
import TableAgents from './pages/tableAgents';
import EditAgent from './pages/editAgent';
//import ProfileSearch from './pages/profileSearch';
import AuthErrorScreen from './pages/authErrorScreen';
import UnknownAgentNotice from './pages/unknownAgentNotice';

import { LoadingProvider, useLoading } from './providers/loadingProvider';
import { fetchAgentData, fetchTableData } from './utils/api';

import { AgentsProvider, useAgents } from './context/agentsContext';
import { TicketsProvider, useTickets } from './context/ticketsContext';
import { SignalRProvider, useSignalR } from './context/signalRContext';
import { FiltersProvider } from './context/filterContext';
import { AuthProvider, useAuth } from './context/authContext';
import { useNotification, NotificationProvider } from './context/notificationsContext';
import { ProfilePhotoProvider } from './context/profilePhotoContext';
import MsalProviderWrapper from './providers/msalProvider';

import MainLayout from './layouts/mainLayout';
import MinimalCenteredLayout from './layouts/minimalCenterLayout';

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

  /*useEffect(() => {
    initializeSignalR();
  }, [initializeSignalR]);*/

  useEffect(() => {
  initializeSignalR({
    onTicketCreated: (ticket) => {
      showNotification(`🎫 New case from ${ticket.patient_name || 'Unknown patient'}`, 'success');
    },
    // No notificar por actualización (o podrías poner otra lógica más selectiva)
    // onTicketUpdated: (ticket) => { ... }
  });
}, [initializeSignalR, showNotification]);
 

  if (!authLoaded) return null;
  if (!authLoaded || !user || !agents || agents.length === 0) return null;

const knownAgent = agents.find(agent => agent.agent_email === user.username);
if (authError) return <Navigate to="/auth-error" replace />;
if (!knownAgent) return <Navigate to="/unknown-agent" replace />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#f8fafd', minHeight: '100vh' }}>
      <Box sx={{ height: 150 }} /> {/*Espaciador para separar el topBar del contenido de abajo*/}
      {/**Layout con sideBar y topBar */}
      <Routes>
        <Route element={<MainLayout agentEmail={agentEmail} filters={filters} setFilters={setFilters} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<TableTickets filters={filters} />} />
          <Route path="/agents" element={<TableAgents />} />
          <Route path="/tickets/edit/:ticketId" element={<EditTicket />} />
          <Route path="/agent/edit" element={<EditAgent />} />
        </Route>

        <Route element={<MinimalCenteredLayout />}>
          <Route path="/auth-error" element={<AuthErrorScreen errorMessage={authError} onRetry={login} />} />
          <Route path="/unknown-agent" element={
            <UnknownAgentNotice userEmail={user.username} onRetry={() => window.location.reload()} />}     />
        </Route>
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <MsalProviderWrapper>
      <AgentsProvider> {/* 👈 Esto debe estar antes */}
        <AuthProvider>  {/* 👈 Ahora sí puede usar useAgents */}
          <LoadingProvider>
            <TicketsProvider>
              <SignalRProvider>
                <NotificationProvider>
                  <FiltersProvider>
                    <ProfilePhotoProvider>
                      <BrowserRouter>
                        <AppContent />
                      </BrowserRouter>
                    </ProfilePhotoProvider>
                  </FiltersProvider>
                </NotificationProvider>
              </SignalRProvider>
            </TicketsProvider>
          </LoadingProvider>
        </AuthProvider>
      </AgentsProvider>
    </MsalProviderWrapper>
  );
}

export default App;