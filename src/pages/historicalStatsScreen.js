import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
} from '@mui/material';
import { useMsal } from '@azure/msal-react';
import {
  useHistoricalStats,
  useFetchAllHistoricalStatistics,
} from '../context/historicalStatsContext';
import { useHistoricalDoneFetchStatistics } from '../context/doneHistoricalTicketsContext';

import RightDrawer from '../components/rightDrawer';
import { HistoricalTopAgents } from '../components/topAgentsSection';
import { HistoricalCallsByHour } from '../components/callsByHourChart';
import { HistoricalTicketRiskChart } from '../components/ticketsRiskChart';
import { HistoricalTicketCategoriesChart } from '../components/ticketsCategoriesChart';
import { HistoricalTicketPriorityChart } from '../components/ticketsPriorityChart';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';
import { HistoricalAverageResolutionTime } from '../components/averageResolutionTime';
import { HistoricalTopPerformerCard } from '../components/topPerformerCard';
import { getTicketsByStatus, getTicketsByIds } from '../utils/apiStats';
import FloatingSettingsButton from '../components/components/floatingSettingsButton.jsx';
import StatusFilterBoxes from '../components/statusFilterBoxes'; // ✅ importa tu componente reutilizable
import FloatingDateSelector from '../components/auxiliars/floatingDateSelector.jsx';
import { useLocation } from 'react-router-dom';

const HistoricStatistics = () => {
  const { accounts, instance } = useMsal();
  const { state } = useHistoricalStats();
  const fetchAllHistoricalStats = useFetchAllHistoricalStatistics();
  const fetchHistoricalDoneTickets = useHistoricalDoneFetchStatistics();

  const [date, setDate] = useState('');
  const [, setLoading] = useState(false);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  const location = useLocation();
  const [showDateSelector, setShowDateSelector] = useState(false);

useEffect(() => {
  if (location.state?.openDateSelector) {
    setShowDateSelector(true);
  }
}, [location.state]);


  const handleFetch = async () => {
    if (!date) return;
    try {
      setLoading(true);
      const accessToken = await instance
        .acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        })
        .then((res) => res.accessToken)
        .catch((err) => {
          console.error('Error acquiring token', err);
          return null;
        });

      if (accessToken) {
        setAccessTokenMSAL(accessToken);
        await fetchAllHistoricalStats(accessToken, date);
        await fetchHistoricalDoneTickets(accessToken, date);
      }
    } catch (err) {
      console.error('Error fetching stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBoxClick = (status) => {
  setSelectedStatus(status);
  setSelectedTicketIds([]); // 👈 limpiar
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
  setSelectedStatus(null); // 👈 limpiar
  setSelectedTicketIds(ticketIds);
  setDrawerStatus(category);
  setDrawerOpen(true);
};

  const statistics = state.historical_statistics || {};

  return (
    <>
      <FloatingSettingsButton />
      {/* 🔍 Selector de fecha */}
      {showDateSelector && (
        <FloatingDateSelector
          date={date}
          setDate={setDate}
          onSearch={handleFetch}
          onClose={() => setShowDateSelector(false)}
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
          ticketsCountByStatus={statistics}
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
              <HistoricalTopPerformerCard />
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
              <HistoricalAverageResolutionTime />
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
              <HistoricalTicketCategoriesChart onCategoryClick={handleCategoryClick} />
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
              <HistoricalTicketRiskChart onCategoryClick={handleCategoryClick} />
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
              <HistoricalTicketPriorityChart onCategoryClick={handleCategoryClick} />
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

      {/**By status */}
      <RightDrawer
        key={`${drawerStatus}-${selectedTicketIds.join(',')}`}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        status={drawerStatus}
        fetchFn={({ continuationToken, limit }) => {
          if (selectedTicketIds.length > 0) {
            return getTicketsByIds(accessTokenMSAL, selectedTicketIds, {
              params: { continuationToken, limit }
            });
          }
          return getTicketsByStatus(accessTokenMSAL, selectedStatus, date, {
            params: { continuationToken, limit }
          });
        }}
        fetchParams={{
          status: selectedStatus,
          date,
          ids: selectedTicketIds
        }}
      />

    </>
  );
};

export default HistoricStatistics;
