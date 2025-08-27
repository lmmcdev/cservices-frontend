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
import MonthlyStatistics from '../pages/monthlyStatsScreen.js';
import { HistoricalStatsProvider } from '../context/historicalStatsContext';
import { MonthlyStatsProvider } from '../context/monthlyStatsContext.js';

// ✅ Lazy-loaded pages
const TableTickets = lazy(() => import('../pages/tableTickets'));
const EditTicket = lazy(() => import('../pages/editTicketLocal'));
const TableAgents = lazy(() => import('../pages/tableAgents'));
const EditAgent = lazy(() => import('../pages/editAgent'));
const AuthErrorScreen = lazy(() => import('../pages/authErrorScreen'));
const UnknownAgentNotice = lazy(() => import('../pages/unknownAgentNotice'));
const StatsScreen = lazy(() => import('../pages/statsScreen'));
const ProfileSearch = lazy(() => import('../pages/profileSearch'));
const SearchPatientDeep = lazy(() => import('../components/components/patients/patientsDeepSearch'));
const SearchTicketDeep = lazy(() => import('../components/components/tickets/ticketsDeepSeacrh'));
const ReportsScreen = lazy(() => import('../pages/reportsScreen'));

// ✅ Monthly en lazy y con el nombre/archivo correcto (minúsculas, con "h")

export default function AppRoutes({ agentData, filters, setFilters, authError, login, user }) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<MainLayout agentData={agentData} filters={filters} setFilters={setFilters} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<TableTickets filters={filters} />} />
            <Route path="agents" element={<TableAgents />} />
            <Route path="tickets/edit/:ticketId" element={<EditTicket />} />
            <Route path="agent/edit/:id" element={<EditAgent />} />
            <Route path="profile-search" element={<ProfileSearch />} />
            <Route path="patient-search" element={<SearchPatientDeep />} />
            <Route path="ticket-search" element={<SearchTicketDeep />} />
            <Route path="reports" element={<ReportsScreen />} />
          </Route>

          <Route element={<LayoutWithSidebarOnly />}>
            <Route path="/statistics" element={<StatsScreen />} />

            <Route
              path="/historical_statistics"
              element={
                  <HistoricalStatsProvider>
                    <HistoricStatistics />
                  </HistoricalStatsProvider>
              }
            />

            {/* 🆕 Monthly */}
            <Route
              path="/monthly_statistics"
              element={
                  <MonthlyStatsProvider>
                    <MonthlyStatistics />
                  </MonthlyStatsProvider>
              }
            />
          </Route>
        </Route>

        <Route element={<MinimalCenteredLayout />}>
          <Route path="/auth-error" element={<AuthErrorScreen errorMessage={authError} onRetry={login} />} />
          <Route path="/unknown-agent" element={<UnknownAgentNotice userEmail={user?.username} onRetry={() => window.location.reload()} />} />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
}
