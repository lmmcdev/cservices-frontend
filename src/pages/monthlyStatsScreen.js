// src/pages/MonthlyStatsScreen.js
import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';

import {
  useHistoricalStats,
  useFetchAllHistoricalStatistics,
} from '../context/historicalStatsContext';

import RightDrawer from '../components/includes/rightDrawer.js';
import { HistoricalTopAgents } from '../components/auxiliars/charts/topAgentsSection.jsx';
import { HistoricalCallsByHour } from '../components/auxiliars/charts/callsByHourChart.jsx';
import { HistoricalTicketRiskChart } from '../components/auxiliars/charts/ticketsRiskChart.jsx';
import { HistoricalTicketCategoriesChart } from '../components/auxiliars/charts/ticketsCategoriesChart.jsx';
import { HistoricalTicketPriorityChart } from '../components/auxiliars/charts/ticketsPriorityChart.jsx';
import ActiveAgents from '../components/auxiliars/charts/activeAgents.jsx';
import CustomerSatisfaction from '../components/auxiliars/charts/customerSatisfaction.jsx';
import { HistoricalAverageResolutionTime } from '../components/auxiliars/charts/averageResolutionTime.jsx';
import { HistoricalTopPerformerCard } from '../components/auxiliars/charts/topPerformerCard.jsx';
import { getTicketsByIds } from '../utils/apiStats';

import FloatingSettingsButton from '../components/auxiliars/charts/floatingSettingsButton.jsx';
import StatusFilterBoxes from '../components/auxiliars/statusFilterBoxes.jsx';
import FloatingMonthSelector from '../components/auxiliars/charts/floatingMonthSelector.jsx';

const MonthlyStatsScreen = () => {
  const { stateStats } = useHistoricalStats();
  const fetchAllHistoricalStats = useFetchAllHistoricalStatistics();

  const [month, setMonth] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  const location = useLocation();
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  useEffect(() => {
    if (location.state?.openDateSelector && location.state?.mode === 'month') {
      setShowMonthSelector(true);
    }
  }, [location.state]);

  const handleFetch = async () => {
    if (!month) return;
    const dispatchAction = 'SET_HISTORIC_MONTHLY_STATS';
    await fetchAllHistoricalStats(month, dispatchAction);
  };

  const handleBoxClick = (status) => {
    setSelectedStatus(status);
    setDrawerStatus(status);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerStatus('');
    setSelectedStatus(null);
    setSelectedTicketIds([]);
  };

  const handleCategoryClick = ({ category, ticketIds }) => {
    setSelectedStatus(null);
    setSelectedTicketIds(ticketIds);
    setDrawerStatus(category);
    setDrawerOpen(true);
  };

  const statistics = stateStats.historic_monthly_stats || {};

  return (
    <>
      <FloatingSettingsButton />

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
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 0,
              flexGrow: 0,
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <HistoricalTopPerformerCard />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <CustomerSatisfaction />
            </Box>
          </Grid>

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
              <HistoricalAverageResolutionTime />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ActiveAgents />
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={3}
            sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
            <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
              <HistoricalTicketCategoriesChart onCategoryClick={handleCategoryClick} />
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={2}
            sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
            <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
              <HistoricalTicketRiskChart onCategoryClick={handleCategoryClick} />
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={1}
            sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
            <Box sx={{ width: '100%', height: '100%', flex: 1 }}>
              <HistoricalTicketPriorityChart onCategoryClick={handleCategoryClick} />
            </Box>
          </Grid>
        </Grid>

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
              <HistoricalTopAgents />
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
              <HistoricalCallsByHour />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <RightDrawer
        key={`${drawerStatus}-${selectedTicketIds.join(',')}`}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        status={drawerStatus}
        fetchFn={({ continuationToken, limit }) => {
          if (selectedTicketIds.length > 0) {
            return getTicketsByIds(selectedTicketIds, {
              params: { continuationToken, limit },
            });
          }
        }}
        fetchParams={{
          status: selectedStatus,
          month,
          ids: selectedTicketIds,
        }}
      />
    </>
  );
};

export default MonthlyStatsScreen;
