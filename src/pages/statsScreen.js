import React, { useEffect, useState, useCallback } from 'react';
import { useStatsState, useFetchStatistics } from '../context/statsContext';
import { useDoneFetchStatistics } from '../context/doneTicketsContext';
import { useMsal } from '@azure/msal-react';
import {
  Box,
  Grid,
} from '@mui/material';
import RightDrawer from '../components/rightDrawer';

import { DailyCallsByHour } from '../components/callsByHourChart';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';
import { getTicketsByStatus, getTicketsByIds } from '../utils/apiStats';
import { DailyTicketRiskChart } from '../components/ticketsRiskChart.jsx';
import { DailyTopAgents } from '../components/topAgentsSection';
import { DailyTicketCategoriesChart } from '../components/ticketsCategoriesChart.jsx';
import { DailyTicketPriorityChart } from '../components/ticketsPriorityChart.jsx';
import { DailyAverageResolutionTime } from '../components/averageResolutionTime';
import { DailyTopPerformerCard } from '../components/topPerformerCard';

import FloatingSettingsButton from '../components/components/floatingSettingsButton';
import StatusFilterBoxes from '../components/statusFilterBoxes'; // ✅ reutilizado

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  const fetchDoneStats = useDoneFetchStatistics();
  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);

  const time = Date.now();
  const today = new Date(time);
  const selectedDate = today.toLocaleDateString('en-CA'); // ✅ formato YYYY-MM-DD

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await instance
          .acquireTokenSilent({
            scopes: ['User.Read'],
            account: accounts[0],
          })
          .then(response => response.accessToken)
          .catch(error => {
            console.error('Error acquiring token', error);
            return null;
          });

        if (accessToken) {
          setAccessTokenMSAL(accessToken);
          await fetchStatistics(accessToken);
          await fetchDoneStats(accessToken);
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

  const statistics = state.statistics || {};
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');

  /** ✅ fetchFn dinámico usando useCallback */
  const fetchFn = useCallback(
    ({ continuationToken, limit }) => {
      if (selectedTicketIds.length > 0) {
        // ✅ Por IDs
        return getTicketsByIds(accessTokenMSAL, selectedTicketIds, {
          params: { continuationToken, limit },
        });
      }
      // ✅ Por Status
      return getTicketsByStatus(accessTokenMSAL, selectedStatus, selectedDate, {
        params: { continuationToken, limit },
      });
    },
    [accessTokenMSAL, selectedTicketIds, selectedStatus, selectedDate]
  );

  return (
    <>
      <FloatingSettingsButton />

      {/* ✅ StatusFilterBoxes */}
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <StatusFilterBoxes
            selectedStatus={selectedStatus}
            setSelectedStatus={handleBoxClick}
            ticketsCountByStatus={{ ...Object.fromEntries(entries), Total: statistics.total }}
          />
        </Grid>
      
        <Grid item xs={2}>
          <CustomerSatisfaction />
        </Grid>

        <Grid item xs={2}>
          <ActiveAgents />
        </Grid>
      </Grid>

      {/* ✅ Charts */}
      <Grid container spacing={2} mb={2} ml={2}>
        <Grid size={8}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <DailyCallsByHour />
          </Box>
        </Grid>

        <Grid size={4}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <DailyTicketRiskChart onCategoryClick={handleCategoryClick} />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <DailyTicketPriorityChart onCategoryClick={handleCategoryClick} />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={8}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <DailyTicketCategoriesChart onCategoryClick={handleCategoryClick} />
          </Box>
        </Grid>
      </Grid>

      {/* ✅ Sección inferior */}
      <Grid container spacing={2} mb={2} ml={2}>
        <Grid size={4}>
          <DailyTopAgents />
        </Grid>
        <Grid size={4}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <DailyTopPerformerCard />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <DailyAverageResolutionTime />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

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
