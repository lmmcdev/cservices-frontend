import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import RightDrawer from '../components/includes/rightDrawer.js';

import { DailyCallsByHour } from '../components/auxiliars/charts/callsByHourChart.jsx';
import ActiveAgents from '../components/auxiliars/charts/activeAgents.jsx';
import CustomerSatisfaction from '../components/auxiliars/charts/customerSatisfaction.jsx';
import { getTicketsByIds, getDailyStats } from '../utils/apiStats';
import { DailyTicketRiskChart } from '../components/auxiliars/charts/ticketsRiskChart.jsx';
import { DailyTopAgents } from '../components/auxiliars/charts/topAgentsSection.jsx';
import { DailyTicketCategoriesChart } from '../components/auxiliars/charts/ticketsCategoriesChart.jsx';
import { DailyTicketPriorityChart } from '../components/auxiliars/charts/ticketsPriorityChart.jsx';
import { DailyAverageResolutionTime } from '../components/auxiliars/charts/averageResolutionTime.jsx';
import { DailyTopPerformerCard } from '../components/auxiliars/charts/topPerformerCard.jsx';
import { useDailyStatsDispatch } from '../context/dailyStatsContext.js';

import FloatingSettingsButton from '../components/auxiliars/charts/floatingSettingsButton.jsx';
import StatusFilterBoxes from '../components/auxiliars/statusFilterBoxes.jsx';


// 🔸 igual que en tableTickets
import { useTicketsData } from '../components/hooks/useTicketsData.js';
import { filterTickets } from '../utils/tickets/selectors.js';

// helpers para contar por status (mismo flow que tableTickets)
const KNOWN_STATUSES = ['New', 'Emergency', 'In Progress', 'Pending', 'Done', 'Duplicated'];
function countByStatus(rows = []) {
  const acc = Object.fromEntries(KNOWN_STATUSES.map(s => [s, 0]));
  for (const r of rows) {
    const s = r?.status;
    if (acc.hasOwnProperty(s)) acc[s] += 1;
  }
  acc.Total = rows.length;
  return acc;
}

export default function StatsScreen() {
  //const state = useDailyStatsState();
  //const fetchStatistics = useFetchStatistics();
  //const fetchDoneStats = useDoneFetchStatistics();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  const today = new Date();
  const selectedDate = today.toLocaleDateString('en-CA'); // YYYY-MM-DD

  const dailyStatsDispatch = useDailyStatsDispatch();

  // ✅ fuente de verdad para los counts (como tableTickets)
  const { tickets, ticketsVersion } = useTicketsData({ auto: true });

  // ✅ refetch de dailyStats (para charts) — opcional llamar cuando mutas algo
  const refetchDailyStats = useCallback(async () => {
    try {
      const result = await getDailyStats(selectedDate);
      if (result?.success) {
        dailyStatsDispatch({ type: 'SET_DAILY_STATS', payload: result });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [selectedDate, dailyStatsDispatch]);

  useEffect(() => { refetchDailyStats(); }, [refetchDailyStats]);

  // ✅ base para contadores (sin filtrar por status)
  const baseRows = useMemo(() => {
    return filterTickets(tickets, {
      status: 'Total',
      date: selectedDate, // quítalo si tu selector no filtra por fecha aquí
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsVersion, tickets, selectedDate]);

  // ✅ contadores dinámicos
  const ticketsCountByStatus = useMemo(() => countByStatus(baseRows), [baseRows]);

  // click en box de status → abre drawer con ese filtro
  const handleBoxClick = (status) => {
    /*setSelectedTicketIds([]);
    setSelectedStatus(status);
    setDrawerStatus(status);
    setDrawerOpen(true);*/
  };

  // click en categoría (IDs)
  const handleCategoryClick = ({ category, ticketIds }) => {
    setSelectedStatus(null);
    setSelectedTicketIds(ticketIds || []);
    setDrawerStatus(category);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerStatus('');
    setSelectedStatus(null);
    setSelectedTicketIds([]);
  };

  //const statistics = state.daily_statistics || {};

  /** ✅ fetchFn dinámico usando useCallback */
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFn = useCallback(
    ({ continuationToken, limit }) => {
      return getTicketsByIds(selectedTicketIds, { params: { continuationToken, limit } });
    }
  );

  return (
    <>
      <FloatingSettingsButton />
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: 'calc(100vh - 64px)',
          overflowX: 'hidden',
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* 🔹 Filter Boxes — ahora con counts que reaccionan al contexto de tickets */}
        <Box sx={{ width: '100%' }}>
          <StatusFilterBoxes
            selectedStatus={selectedStatus}
            setSelectedStatus={handleBoxClick}
            ticketsCountByStatus={ticketsCountByStatus}
          />
        </Box>

        <Grid
          container
          spacing={2}
          sx={{ mt: 0, flexWrap: 'nowrap', width: '100%', minHeight: 300 }}
        >
          {/* Top Performer + CSAT */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flexGrow: 0 }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <DailyTopPerformerCard />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <CustomerSatisfaction />
            </Box>
          </Grid>

          {/* Avg Resolution + Active Agents */}
          <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flexGrow: 0 }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <DailyAverageResolutionTime />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ActiveAgents />
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} md={3} sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
              <DailyTicketCategoriesChart onCategoryClick={handleCategoryClick} />
            </Box>
          </Grid>

          {/* Risk */}
          <Grid item xs={12} md={2} sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
              <DailyTicketRiskChart onCategoryClick={handleCategoryClick} />
            </Box>
          </Grid>

          {/* Priority */}
          <Grid item xs={12} md={1} sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
              <DailyTicketPriorityChart onCategoryClick={handleCategoryClick} />
            </Box>
          </Grid>
        </Grid>

        {/* Row 2 */}
        <Grid container spacing={2} sx={{ width: '100%', m: 0, p: 0, flexWrap: 'nowrap', flex: 1, minHeight: 0 }}>
          <Grid item xs={12} md={5} sx={{ flex: 1, minWidth: 0, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <DailyTopAgents />
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ flex: 2, minWidth: 0, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <DailyCallsByHour />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Drawer */}
      <RightDrawer
        key={`${drawerStatus}-${selectedTicketIds.join(',')}`}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        status={drawerStatus}
        fetchFn={fetchFn}
        fetchParams={{ status: selectedStatus, date: selectedDate, ids: selectedTicketIds }}
        // 🔸 si en tu drawer actualizas tickets con dispatch, los counts ya reaccionan solos.
        // 🔸 si además quieres refrescar charts al terminar una mutación:
        onStatusChange={refetchDailyStats}
      />
    </>
  );
}
