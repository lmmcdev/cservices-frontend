// src/routes/AppRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import SuspenseFallback from '../components/auxiliars/suspenseFallback';
import MainLayout from '../layouts/mainLayout';
import LayoutWithSidebarOnly from '../layouts/sideBarLayout';
import MinimalCenteredLayout from '../layouts/minimalCenterLayout';
import PrivateRoute from '../components/privateRoute';
import NotFound404 from '../pages/404';
import HistoricStatistics from '../pages/historicalStatsScreen';
import { HistoricalStatsProvider } from '../context/historicalStatsContext';
import { DoneTicketsProvider } from '../context/doneTicketsContext';
import { DoneHistoricalTicketsProvider } from '../context/doneHistoricalTicketsContext';
import { LoadingProvider } from '../providers/loadingProvider';

// ...otros imports lazy
// Lazy-loaded pages
const TableTickets = lazy(() => import('../pages/tableTickets'));
const EditTicket = lazy(() => import('../pages/editTicket'));
const TableAgents = lazy(() => import('../pages/tableAgents'));
const EditAgent = lazy(() => import('../pages/editAgent'));
const AuthErrorScreen = lazy(() => import('../pages/authErrorScreen'));
const UnknownAgentNotice = lazy(() => import('../pages/unknownAgentNotice'));
const StatsScreen = lazy(() => import('../pages/statsScreen'));
//const HistoricalStats = lazy(() => import ('./pages/historicalStatsScreen'));
const ProfileSearch = lazy(() => import('../pages/profileSearch'));
const SearchPatientDeep = lazy(() => import('../components/components/patients/patientsDeepSearch'));
const SearchTicketDeep = lazy(() => import('../components/components/tickets/ticketsDeepSeacrh'));



export default function AppRoutes({ agentEmail, filters, setFilters, authError, login, user }) {
  return (
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
            <Route path="/statistics" element={<StatsScreen />} />
            <Route path="/historical_statistics" element={
              <LoadingProvider>
                <HistoricalStatsProvider>
                  <DoneTicketsProvider>
                    <DoneHistoricalTicketsProvider>
                      <HistoricStatistics />
                    </DoneHistoricalTicketsProvider>
                  </DoneTicketsProvider>
                </HistoricalStatsProvider>
              </LoadingProvider>
            } />
          </Route>

          <Route element={<MinimalCenteredLayout />}>
            <Route path="/auth-error" element={<AuthErrorScreen errorMessage={authError} onRetry={login} />} />
            <Route path="/unknown-agent" element={<UnknownAgentNotice userEmail={user?.username} onRetry={() => window.location.reload()} />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
}
