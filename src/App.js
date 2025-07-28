// src/App.js
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts and utilities
import { LoadingProvider } from './providers/loadingProvider';
import { AgentsProvider } from './context/agentsContext';
import { TicketsProvider } from './context/ticketsContext';
import { SignalRProvider, useSignalR } from './context/signalRContext';
import { FiltersProvider } from './context/filterContext';
import { AuthProvider, useAuth } from './context/authContext';
import { NotificationProvider, useNotification } from './context/notificationsContext';
import { ProfilePhotoProvider } from './context/profilePhotoContext';
import MsalProviderWrapper from './providers/msalProvider';
import { StatsProvider } from './context/statsContext';
import { HistoricalStatsProvider } from './context/historicalStatsContext';
import HistoricStatistics from './pages/historicalStatsScreen';
import SuspenseFallback from './components/auxiliars/suspenseFallback';
import { SidebarProvider } from './context/sidebarContext';
import { DoneTicketsProvider } from './context/doneTicketsContext';
import { DoneHistoricalTicketsProvider } from './context/doneHistoricalTicketsContext';
import { DailyStatsProvider } from './context/dailyStatsContext';

import MainLayout from './layouts/mainLayout';
import MinimalCenteredLayout from './layouts/minimalCenterLayout';
import LayoutWithSidebarOnly from './layouts/sideBarLayout';
import PrivateRoute from './components/privateRoute';
import NotFound404 from './pages/404';
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

  //notifications push
  useEffect(() => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    registerForPushNotifications();
  }
}, []);


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
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route element={<MainLayout agentEmail={agentEmail} filters={filters} setFilters={setFilters} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<TableTickets filters={filters} />} />
              <Route path="agents" element={<TableAgents />} />
              <Route path="tickets/edit/:ticketId" element={<EditTicket />} />
              <Route path="agent/edit/:id" element={<EditAgent />} />
              <Route path="profile-search" element={<ProfileSearch />} />
              <Route path="patient-search" element={<SearchPatientDeep />} />
              <Route path="ticket-search" element={<SearchTicketDeep />} />
            </Route>
          

          <Route element={<LayoutWithSidebarOnly />}>
            <Route path='/statistics' element={<StatsScreen />} />
            <Route path='/historical_statistics' element={<LoadingProvider><HistoricalStatsProvider><DoneTicketsProvider><DoneHistoricalTicketsProvider><HistoricStatistics /></DoneHistoricalTicketsProvider></DoneTicketsProvider></HistoricalStatsProvider></LoadingProvider>} />
          </Route>

          <Route element={<MinimalCenteredLayout />}>
            <Route path="/auth-error" element={<AuthErrorScreen errorMessage={authError} onRetry={login} />} />
            <Route path="/unknown-agent" element={<UnknownAgentNotice userEmail={user?.username} onRetry={() => window.location.reload()} />} />
          </Route>
        </Route>
          <Route path="*" element={<NotFound404 />} />
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
              <DoneTicketsProvider>
              <TicketsProvider>
                <DailyStatsProvider>
                <SignalRProvider>
                  <NotificationProvider>
                    <FiltersProvider>
                      <ProfilePhotoProvider>
                        <SidebarProvider>
                          <BrowserRouter>
                            <AppContent />
                          </BrowserRouter>
                        </SidebarProvider>
                      </ProfilePhotoProvider>
                    </FiltersProvider>
                  </NotificationProvider>
                </SignalRProvider>
                </DailyStatsProvider>
              </TicketsProvider>
              </DoneTicketsProvider>
            </StatsProvider>
            
          </LoadingProvider>
        </AuthProvider>
      </AgentsProvider>
    </MsalProviderWrapper>
  );
}

export default App;
