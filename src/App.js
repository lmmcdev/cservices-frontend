// src/App.js
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// Contexts and utilities
import AppProviders from './providers/appProvider';
import AppRoutes from './routes/appRoutes';

import { useSignalR } from './context/signalRContext';
import { useAuth } from './context/authContext';
import { useAgents } from './context/agentsContext';
import { useNotification } from './context/notificationsContext';
import MsalProviderWrapper from './providers/msalProvider';
import { useInitAppData } from './components/hooks/useInitAppData';
//import { registerForPushNotifications } from './utils/js/registerPush';
import { setupFetchAuth } from './setupFetchAuth';


import './App.css';
import SuspenseFallback from './components/auxiliars/suspenseFallback';

function AppContent() {
  React.useEffect(() => {
    setupFetchAuth();
  }, []); // ← una sola vez
  const { showNotification } = useNotification();
  const { initializeSignalR } = useSignalR();
  const { user, authError, login, authLoaded, authReady } = useAuth();
  const [agentEmail, setAgentEmail] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    assignedAgents: [],
    callerIds: [],
  });
  const { state, } = useAgents();
  const agent = state.agents.find(a => a.agent_email === agentEmail );
  
  //notifications push
  /*useEffect(() => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    registerForPushNotifications(agent);
  }
}, [agent]);*/


  useEffect(() => {
    if (user?.username) setAgentEmail(user.username);
  }, [user]);

  useInitAppData();

  useEffect(() => {
    initializeSignalR({
      onTicketCreated: (ticket) => {
        showNotification(`🎫 New case from ${ticket.patient_name || 'Unknown patient'}`, 'success');
      },
      onAgentAssignment: (ticket) => {
        showNotification(`👤 You have been assigned as a collaborator on ticket for patient ${ticket.linked_patient_snapshot?.Name || ticket.patient_name || 'Unknown patient'} from location ${ticket.linked_patient_snapshot?.Location || ticket.caller_id || 'Unknown location'}`, 'info');
      },
      onAgentDeAssignment: (ticket) => {
        showNotification(`👤 You have been removed as a collaborator on ticket for patient ${ticket.linked_patient_snapshot?.Name  || ticket.patient_name || 'Unknown ticket'} from location ${ticket.linked_patient_snapshot?.Location || ticket.caller_id || 'Unknown'}`, 'info');
      },
    });
  }, [initializeSignalR, showNotification]);

  if (!authLoaded || !authReady) { return <SuspenseFallback />; }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#f8fafd', minHeight: '100vh' }}>
      <AppRoutes
        filters={filters}
        setFilters={setFilters}
        authError={authError}
        login={login}
        user={user}
        agentData={agent}
      />
    </Box>
  );
}

function App() {
  return (
    <MsalProviderWrapper>
      <AppProviders>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProviders>
    </MsalProviderWrapper>
  );
}

export default App;