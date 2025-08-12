import React, { useEffect, useState, useCallback } from 'react';
//import { useStatsState,  } from '../context/statsContext';
//import { useDoneFetchStatistics } from '../context/doneTicketsContext';
import {
  Box,
  Grid,
} from '@mui/material';
import RightDrawer from '../components/includes/rightDrawer.js';

import { DailyCallsByHour } from '../components/components/charts/callsByHourChart';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';
import { getTicketsByStatus, getTicketsByIds } from '../utils/apiStats';
import { DailyTicketRiskChart } from '../components/components/charts/ticketsRiskChart.jsx';
import { DailyTopAgents } from '../components/topAgentsSection';
import { DailyTicketCategoriesChart } from '../components/ticketsCategoriesChart.jsx';
import { DailyTicketPriorityChart } from '../components/ticketsPriorityChart.jsx';
import { DailyAverageResolutionTime } from '../components/averageResolutionTime';
import { DailyTopPerformerCard } from '../components/topPerformerCard';
import { getDailyStats } from '../utils/apiStats';
import { useDailyStatsDispatch, useDailyStatsState } from '../context/dailyStatsContext.js';

import FloatingSettingsButton from '../components/components/floatingSettingsButton';
import StatusFilterBoxes from '../components/statusFilterBoxes'; // ✅ reutilizado

export default function StatsScreen() {
  const state = useDailyStatsState();
  //const fetchStatistics = useFetchStatistics();
  //const fetchDoneStats = useDoneFetchStatistics();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  const time = Date.now();
  const today = new Date(time);
  const selectedDate = today.toLocaleDateString('en-CA'); // ✅ formato YYYY-MM-DD

  const dailyStatsDispatch = useDailyStatsDispatch(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
          const result = await getDailyStats(selectedDate);
          if (result.success) { 
            dailyStatsDispatch({type: 'SET_DAILY_STATS', payload: result})
          }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** ✅ Manejo de clic en box de status */
  const handleBoxClick = (status) => {
    setSelectedStatus(status);
    setSelectedTicketIds([]); // limpiar
    setDrawerStatus(status);
    setDrawerOpen(true);
  };

  /** ✅ Manejo de clic en categoría (IDs) */
  const handleCategoryClick = ({ category, ticketIds }) => {
    setSelectedStatus(null); // limpiar status
    setSelectedTicketIds(ticketIds);
    setDrawerStatus(category);
    setDrawerOpen(true);
  };

  /** ✅ Cerrar Drawer */
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerStatus('');
    setSelectedStatus(null);
    setSelectedTicketIds([]);
  };

  const statistics = state.daily_statistics || {};

  /** ✅ fetchFn dinámico usando useCallback */
  const fetchFn = useCallback(
    ({ continuationToken, limit }) => {
      if (selectedTicketIds.length > 0) {
        // ✅ Por IDs
        return getTicketsByIds(selectedTicketIds, {
          params: { continuationToken, limit },
        });
      }
      // ✅ Por Status
      return getTicketsByStatus(selectedStatus, selectedDate, {
        params: { continuationToken, limit },
      });
    },
    [selectedTicketIds, selectedStatus, selectedDate]
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

      {/* ✅ StatusFilterBoxes dentro del mismo Box */}
      <Box sx={{ width: '100%' }}>
        <StatusFilterBoxes
          selectedStatus={selectedStatus}
          setSelectedStatus={handleBoxClick}
          ticketsCountByStatus={statistics?.statusCounts || {}}
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
            <DailyTopPerformerCard />
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
            <DailyAverageResolutionTime />
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
            <DailyTicketCategoriesChart onCategoryClick={handleCategoryClick} />
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
            <DailyTicketRiskChart onCategoryClick={handleCategoryClick} />
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
            <DailyTicketPriorityChart onCategoryClick={handleCategoryClick} />
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
              <DailyTopAgents />
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
              <DailyCallsByHour />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ✅ Drawer Único */}
      <RightDrawer
        key={`${drawerStatus}-${selectedTicketIds.join(',')}`}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        status={drawerStatus}
        fetchFn={fetchFn}
        fetchParams={{
          status: selectedStatus,
          date: selectedDate,
          ids: selectedTicketIds,
        }}
      />
    </>
  );
}