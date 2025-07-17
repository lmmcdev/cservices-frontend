import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Stack,
  InputAdornment
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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import FloatingSettingsButton from '../components/components/floatingSettingsButton.jsx';
import StatusFilterBoxes from '../components/statusFilterBoxes'; // ✅ importa tu componente reutilizable

const HistoricStatistics = () => {
  const { accounts, instance } = useMsal();
  const { state } = useHistoricalStats();
  const fetchAllHistoricalStats = useFetchAllHistoricalStatistics();
  const fetchHistoricalDoneTickets = useHistoricalDoneFetchStatistics();

  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

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
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="date"
            label="Seleccionar fecha"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#00a1ff' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleFetch}
            sx={{
              backgroundColor: '#00a1ff',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                backgroundColor: '#0080cc',
              },
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>

      {/* ✅ Status Cards ahora usan StatusFilterBoxes */}
      <Grid container spacing={2}>
        <Grid item xs={5}>
          {loading ? (
            <CircularProgress sx={{ my: 4, ml: 4 }} />
          ) : (
            <StatusFilterBoxes
              selectedStatus={selectedStatus}
              setSelectedStatus={handleBoxClick}
              ticketsCountByStatus={statistics}
            />
          )}
        </Grid>

        <Grid item xs={2}>
          <CustomerSatisfaction />
        </Grid>
        
        <Grid item xs={2}>
          <ActiveAgents />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2} ml={2}>
        {/* Columna izquierda */}
        <Grid size={8}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <HistoricalCallsByHour />
          </Box>
        </Grid>

        {/* Columna derecha */}
        <Grid size={4}>
          <Grid container spacing={2}>
            {/* RiskChart */}
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <HistoricalTicketRiskChart onCategoryClick={handleCategoryClick} />
              </Box>
            </Grid>

            {/* PriorityChart */}
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <HistoricalTicketPriorityChart onCategoryClick={handleCategoryClick} />
              </Box>
            </Grid>

            {/* CategoriesChart - toda la fila 
            <Grid size={12}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <HistoricalTicketCategoriesChart onCategoryClick={handleCategoryClick} />
              </Box>
            </Grid>*/}
          </Grid>
        </Grid>

        <Grid size={8}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <HistoricalTicketCategoriesChart onCategoryClick={handleCategoryClick} />
          </Box>
        </Grid>
      </Grid>

      
      <Grid container spacing={2} mb={2} ml={2}>
        <Grid size={4}>
          <HistoricalTopAgents />
        </Grid>
        <Grid size={4}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <HistoricalTopPerformerCard />
              </Box>
            </Grid>

            <Grid size={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                 <HistoricalAverageResolutionTime />
              </Box>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>


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
