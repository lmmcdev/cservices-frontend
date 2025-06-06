// src/App.js
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

import { LoadingProvider, useLoading } from './components/loadingProvider';
import { AuthProvider, useAuth } from './utils/authContext';
import { SignalRProvider, useSignalR } from './utils/signalRContext';
import { FiltersProvider } from './utils/js/filterContext';
import { fetchAgentData } from './utils/api';

import { AgentsProvider, useAgents } from './components/components/agentsContext';
import MsalProviderWrapper from './providers/msalProvider';

import './App.css';

function AppContent() {
  const { setLoading } = useLoading();
  const { state, dispatch } = useAgents();
  const { initializeSignalR } = useSignalR();
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

    const loadAgents = async () => {
      setLoading(true);
      try {
        const data = await fetchAgentData(dispatch, setLoading);
        if (!isCancelled) {
          dispatch({ type: 'SET_AGENTS', payload: data.message });
          console.log('Loaded agents:', data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
    return () => {
      isCancelled = true;
    };
  }, [setLoading, dispatch]);

  useEffect(() => {
    // initializeSignalR(dispatch);
  }, [initializeSignalR]);

  useEffect(() => {
    console.log('Agents changed:', state.agents);
  }, [state.agents]);

  if (!authLoaded) return null;
  if (authError) return <AuthErrorScreen errorMessage={authError} onRetry={login} />;
  if (!user) return null;


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
          <SignalRProvider>
            <FiltersProvider>
              <AgentsProvider>
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </AgentsProvider>
            </FiltersProvider>
          </SignalRProvider>
        </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;




/* src/App.js
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
import { useAuth } from './utils/authContext';
import { SignalRProvider } from './utils/signalRContext';
import './App.css';

function AppContent() {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const [agentsLoaded, setAgentsLoaded] = useState(false);
  const { user } = useAuth();
  const [agentEmail, setAgentEmail] = useState('');

  //capturando agente logueado.Aqui poner boton en el futuro
  useEffect(() => {
    if (!user?.username) return;
    setAgentEmail(user.username)
  }, [user?.username, setLoading]);

  //cargando agentes
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
      <Topbar agents={agents}  agent={agentEmail}/>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TableTickets agents={agents}/>} />
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
          <SignalRProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </SignalRProvider>
        </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;
*/