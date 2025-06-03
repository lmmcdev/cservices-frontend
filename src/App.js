// src/App.js
import React, { useReducer, useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';
import { LoadingProvider, useLoading } from './components/loadingProvider';
import MsalProviderWrapper from './providers/msalProvider';
import { AuthProvider, useAuth } from "./utils/authContext";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditTicket from './pages/editTicket';
import { ticketReducer, initialState } from './utils/ticketsReducer';
import { fetchAgentData } from './utils/api';
import { SignalRProvider, useSignalR } from './utils/signalRContext';
import { FiltersProvider } from './utils/js/filterContext';
import './App.css';

function AppContent() {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const [agentsLoaded, setAgentsLoaded] = useState(false);
  const { user } = useAuth();
  const [agentEmail, setAgentEmail] = useState('');
  const { initializeSignalR } = useSignalR();

  const [filters, setFilters] = useState({
    date: '',
    assignedAgents: [],
    callerIds: [],
  });
  // Asignar email del usuario MSAL
  useEffect(() => {
    if (user?.username) {
      setAgentEmail(user.username);
    }
  }, [user]);

  // Cargar agentes
  useEffect(() => {
    let isCancelled = false;

    const loadAgents = async () => {
      setLoading(true);
      try {
        await fetchAgentData(dispatch, setLoading);
        if (!isCancelled) setAgentsLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
    return () => {
      isCancelled = true;
    };
  }, [setLoading]);

  // Inicializar SignalR
  useEffect(() => {
    initializeSignalR(dispatch); // Pasamos el dispatch si necesitas actualizar el estado desde SignalR
  }, [initializeSignalR]);

  if (!agentsLoaded) return null; // o spinner

  const { agents } = state;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafd', minHeight: '100vh' }}>
      <CssBaseline />
      <Topbar agents={agents} agent={agentEmail} filters={filters} setFilters={setFilters}/>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TableTickets agents={agents} filters={filters}/>} />
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
            <FiltersProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
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