// src/App.js
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contexts and utilities
import { LoadingProvider, useLoading } from './providers/loadingProvider';
import { AgentsProvider } from './context/agentsContext';
import { TicketsProvider } from './context/ticketsContext';
import { SignalRProvider, useSignalR } from './context/signalRContext';
import { FiltersProvider } from './context/filterContext';
import { AuthProvider, useAuth } from './context/authContext';
import { NotificationProvider, useNotification } from './context/notificationsContext';
import { ProfilePhotoProvider } from './context/profilePhotoContext';
import MsalProviderWrapper from './providers/msalProvider';
import { StatsProvider } from './context/statsContext';
import SuspenseFallback from './components/auxiliars/suspenseFallback';

import MainLayout from './layouts/mainLayout';
import MinimalCenteredLayout from './layouts/minimalCenterLayout';
import LayoutWithSidebarOnly from './layouts/sideBarLayout';
import PrivateRoute from './components/privateRoute';
import { useInitAppData } from './components/hooks/useInitAppData';

import './App.css';


// Lazy-loaded pages
const TableTickets = lazy(() => import('./pages/tableTickets'));
const EditTicket = lazy(() => import('./pages/editTicket'));
const TableAgents = lazy(() => import('./pages/tableAgents'));
const EditAgent = lazy(() => import('./pages/editAgent'));
const AuthErrorScreen = lazy(() => import('./pages/authErrorScreen'));
const UnknownAgentNotice = lazy(() => import('./pages/unknownAgentNotice'));
const StatsScreen = lazy(() => import('./pages/statsScreen'));
const ProfileSearch = lazy(() => import('./pages/profileSearch'));
const NotFoundPage = () => <Box p={4}>404 - Página no encontrada</Box>;


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
      <Box sx={{ mt: { xs: 8, sm: 12 } }} />
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route element={<MainLayout agentEmail={agentEmail} filters={filters} setFilters={setFilters} />}>
              <Route path="/dashboard" element={<TableTickets filters={filters} />} />
              <Route path="/agents" element={<TableAgents />} />
              <Route path="/tickets/edit/:ticketId" element={<EditTicket />} />
              <Route path="/agent/edit/:id" element={<EditAgent />} />
              <Route path="/profile-search" element={<ProfileSearch />} />
            </Route>
          </Route>

          <Route element={<LayoutWithSidebarOnly />}>
            <Route path='/statistics' element={<StatsScreen />} />
          </Route>

          <Route element={<MinimalCenteredLayout />}>
            <Route path="/auth-error" element={<AuthErrorScreen errorMessage={authError} onRetry={login} />} />
            <Route path="/unknown-agent" element={<UnknownAgentNotice userEmail={user?.username} onRetry={() => window.location.reload()} />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Box>
  );
}

function App() {
  return (
    <MsalProviderWrapper>
      <AgentsProvider>
        <AuthProvider>
          <LoadingProvider>
            <StatsProvider>
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
            </StatsProvider>
          </LoadingProvider>
        </AuthProvider>
      </AgentsProvider>
    </MsalProviderWrapper>
  );
}

export default App;
