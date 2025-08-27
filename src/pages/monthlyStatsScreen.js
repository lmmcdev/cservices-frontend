import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import RightDrawer from '../components/includes/rightDrawer.js';
import FloatingSettingsButton from '../components/auxiliars/charts/floatingSettingsButton.jsx';
import StatusFilterBoxes from '../components/auxiliars/statusFilterBoxes.jsx';
import FloatingMonthSelector from '../components/auxiliars/charts/floatingMonthSelector.jsx';

// Chartbases (agnósticos al periodo)
import ActiveAgents from '../components/auxiliars/charts/activeAgents.jsx';
import CustomerSatisfaction from '../components/auxiliars/charts/customerSatisfaction.jsx';
import { MonthlyTopAgents } from '../components/auxiliars/charts/topAgentsSection.jsx';
import { MonthlyCallsByHour } from '../components/auxiliars/charts/callsByHourChart.jsx';
import { MonthlyTicketCategoriesChart } from '../components/auxiliars/charts/ticketsCategoriesChart.jsx';
import { MonthlyTicketPriorityChart } from '../components/auxiliars/charts/ticketsPriorityChart.jsx';
import { MonthlyTicketRiskChart } from '../components/auxiliars/charts/ticketsRiskChart.jsx';
import { MonthlyAverageResolutionTime } from '../components/auxiliars/charts/averageResolutionTime.jsx';
import { MonthlyTopPerformerCard } from '../components/auxiliars/charts/topPerformerCard.jsx';

import { getTicketsByIds } from '../utils/apiStats';

// Contexto mensual
import {
  useMonthlyStats,
  useMonthlyStatusCounts,
} from '../context/monthlyStatsContext';

export default function MonthlyStatistics() {
  const { fetchMonthlyStatsMTD } = useMonthlyStats();
  const statusCount = useMonthlyStatusCounts();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [month, setMonth] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openDateSelector && location.state?.mode === 'month') {
      setShowMonthSelector(true);
    }
  }, [location.state]);
  
  

    useEffect(() => {
      fetchMonthlyStatsMTD(month);
    }, [month, fetchMonthlyStatsMTD]);

    const handleFetch = useCallback(async () => {
      // Re-fetch explícito desde el botón del selector
      await fetchMonthlyStatsMTD(month);
    }, [fetchMonthlyStatsMTD, month]);

  const handleBoxClick = (status) => {
    // En mensual no tenemos IDs por estado en el doc,
    // si en el futuro agregas endpoint "tickets por estado + mes", abre Drawer aquí.
    setSelectedStatus(status || null);
    setSelectedTicketIds([]);
    setDrawerStatus(status || '');
    setDrawerOpen(false);
  };

  const handleCategoryClick = ({ category, ticketIds }) => {
    setSelectedStatus(null);
    setSelectedTicketIds(Array.isArray(ticketIds) ? ticketIds : []);
    setDrawerStatus(category || '');
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerStatus('');
    setSelectedStatus(null);
    setSelectedTicketIds([]);
  };

  const fetchFn = useCallback(
    ({ continuationToken, limit }) => {
      if (!selectedTicketIds.length) return Promise.resolve({ results: [], continuationToken: null });
      return getTicketsByIds(selectedTicketIds, { params: { continuationToken, limit } });
    },
    [selectedTicketIds]
  );

  return (
    <>
      <FloatingSettingsButton />

      {/* 🔍 Selector de fecha (usamos su valor para derivar YYYY-MM) */}
      {showMonthSelector && (
        <FloatingMonthSelector
          month={month}
          setMonth={setMonth}
          onSearch={handleFetch}
          onClose={() => setShowMonthSelector(false)}
        />
      )}

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
      
            {/* ✅ StatusFilterBoxes dentro del mismo Box */}
            <Box sx={{ width: '100%' }}>
              <StatusFilterBoxes
                selectedStatus={selectedStatus}
                setSelectedStatus={handleBoxClick}
                ticketsCountByStatus={statusCount || {}}
              />
            </Box>
      
            <Grid
              container
              spacing={2}
              sx={{
                mt: 0,
                flexWrap: 'nowrap',
                width: '100%',
                minHeight: 300,
              }}
            >
                {/* Top Performer + Customer Satisfaction - 4/12 */}
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,       // 16px entre ambas tarjetas
                    minWidth: 0,
                    flexGrow: 0,  // respeta md={5}
                  }}
                >
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <MonthlyTopPerformerCard />
                  </Box>
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <CustomerSatisfaction />
                  </Box>
      
                </Grid>
      
                {/* Average Resolution & Active Agents – 2/12 */}
                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: 0,
                    flexGrow: 0,
                  }}
                >
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <MonthlyAverageResolutionTime />
                  </Box>
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ActiveAgents />
                  </Box>
                </Grid>
      
                {/* Ticket Categories Breakdown – 3/12 */}
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    flex: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
                    {<MonthlyTicketCategoriesChart onCategoryClick={handleCategoryClick} />}
                  </Box>
                </Grid>
      
                {/* Ticket Risk Breakdown – 2/12 */}
                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    flex: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  }}
                  >
                  <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
                    <MonthlyTicketRiskChart onCategoryClick={handleCategoryClick} />
                  </Box>
                </Grid>
      
                {/* Ticket Priority Breakdown – 1/12 */}
                <Grid
                  item
                  xs={12}
                  md={1}
                  sx={{
                    flex: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  }}
                  >
                  <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
                    <MonthlyTicketPriorityChart onCategoryClick={handleCategoryClick} />
                  </Box>
                </Grid>
              </Grid>
      
      
              {/* 🟨 Fila 2: 2 columnas grandes */}
              <Grid
                container
                spacing={2}
                sx={{
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  flexWrap: 'nowrap',
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <MonthlyTopAgents />
                  </Box>
                </Grid>
      
                <Grid
                  item
                  xs={12}
                  md={7}
                  sx={{
                    flex: 2,
                    minWidth: 0,
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <MonthlyCallsByHour />
                  </Box>
                </Grid>
              </Grid>
            </Box>

      {/* Drawer (IDs desde clics en charts de IA) */}
      <RightDrawer
        key={`${drawerStatus}-${selectedTicketIds.join(',')}`}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        status={drawerStatus}
        fetchFn={fetchFn}
        fetchParams={{ ids: selectedTicketIds }}
        onStatusChange={handleFetch}
      />
    </>
  );
}
