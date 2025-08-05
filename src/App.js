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
import { registerForPushNotifications } from './utils/js/registerPush';

import './App.css';


// Lazy-loaded pages
const TableTickets = lazy(() => import('./pages/tableTickets'));
const EditTicket = lazy(() => import('./pages/editTicket'));
const TableAgents = lazy(() => import('./pages/tableAgents'));
const EditAgent = lazy(() => import('./pages/editAgent'));
const AuthErrorScreen = lazy(() => import('./pages/authErrorScreen'));
const UnknownAgentNotice = lazy(() => import('./pages/unknownAgentNotice'));
const StatsScreen = lazy(() => import('./pages/statsScreen'));
//const HistoricalStats = lazy(() => import ('./pages/historicalStatsScreen'));
const ProfileSearch = lazy(() => import('./pages/profileSearch'));
const SearchPatientDeep = lazy(() => import('./components/components/patients/patientsDeepSeacrh'));
const SearchTicketDeep = lazy(() => import('./components/components/tickets/ticketsDeepSeacrh'))


function AppContent() {
  const { showNotification } = useNotification();
  const { initializeSignalR } = useSignalR();
  const { user, authError, login, authLoaded } = useAuth();
  const [agentEmail, setAgentEmail] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    assignedAgents: [],
    callerIds: [],
  });
  const { state, } = useAgents();
  const agent = state.agents.find(a => a.agent_email === agentEmail );
  
  //notifications push
  useEffect(() => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    registerForPushNotifications(agent);
  }
}, [agent]);


  useEffect(() => {
    if (user?.username) setAgentEmail(user.username);
  }, [user]);

  useInitAppData();

  useEffect(() => {
    initializeSignalR({
      onTicketCreated: (ticket) => {
        showNotification(`🎫 New case from ${ticket.patient_name || 'Unknown patient'}`, 'success');
      },
    });
  }, [initializeSignalR, showNotification]);

  if (!authLoaded) return <Box p={4}>Cargando...</Box>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#f8fafd', minHeight: '100vh' }}>
      <AppRoutes
        agentEmail={agentEmail}
        filters={filters}
        setFilters={setFilters}
        authError={authError}
        login={login}
        user={user}
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
