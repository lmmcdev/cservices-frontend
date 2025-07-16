import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useMsal } from '@azure/msal-react';

import {
  useHistoricalStats,
  useFetchAllHistoricalStatistics,
} from '../context/historicalStatsContext';
import {
  useHistoricalDoneFetchStatistics,
} from '../context/doneHistoricalTicketsContext';
//import { useDoneStatsState } from '../context/doneTicketsContext';

import RightDrawer from '../components/rightDrawer';
import { getStatusColor } from '../utils/js/statusColors';
import { HistoricalTopAgents } from '../components/topAgentsSection';
import { HistoricalCallsByHour } from '../components/callsByHourChart';
import { HistoricalTicketRiskChart } from '../components/ticketsRiskChart';
import IdsTicketsCard from '../components/ticketsByIdsBoard';
import { HistoricalTicketCategoriesChart } from '../components/ticketsCategoriesChart';
import { HistoricalTicketPriorityChart } from '../components/ticketsPriorityChart';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';
import { HistoricalAverageResolutionTime } from '../components/averageResolutionTime';
import { HistoricalTopPerformerCard } from '../components/topPerformerCard';
import StatusTicketsCard from '../components/ticketsByStatusBoard.js';
import { getTicketsByStatus, getTicketsByIds } from '../utils/apiStats';



const HistoricStatistics = () => {
  const { accounts, instance } = useMsal();

  const { state } = useHistoricalStats();
  const fetchAllHistoricalStats = useFetchAllHistoricalStatistics();
  //const doneState = useDoneStatsState();
  //const [minCalls] = useState(0);

  const fetchHistoricalDoneTickets = useHistoricalDoneFetchStatistics();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [drawerStatus, setDrawerStatus] = useState('');
  const [drawerTickets, setDrawerTickets] = useState([]);

  const handleFetch = async () => {
    if (!date) return;

    try {
      setLoading(true);

      const accessToken = await instance
        .acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        })
        .then((response) => response.accessToken)
        .catch((error) => {
          console.error('Error acquiring token', error);
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
  setSelectedTicketIds([]); // Limpia cualquier selección por IDs
  setDrawerTickets([]);     // Limpia tickets previos
  setDrawerStatus(status);
  setDrawerOpen(true);
};

 
  const handleOpenDrawer = ({ status, tickets }) => {
    setDrawerStatus(status);
    setDrawerTickets(tickets);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerStatus('');
    setDrawerTickets([]);
  };

  const handleCategoryClick = ({ category, ticketIds }) => {
    console.log(ticketIds)
  setSelectedTicketIds(ticketIds);
  setDrawerStatus(category);
  setDrawerTickets([]); // Limpia tickets previos
  setDrawerOpen(true);
};

  

  const statistics = state.historical_statistics || {};

  //const doneStatistics = doneState.closedTickets_statistics || {};
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');

  /*const transformed = doneStatistics.map((item, index) => ({
    id: index + 1,
    name: item.agent_assigned,
    callsAttended: item.resolvedCount,
  }));*/

/*const filteredSortedAgents = useMemo(() => {
    return transformed
      .filter(agent => agent.callsAttended >= minCalls)
      .sort((a, b) => b.callsAttended - a.callsAttended);
  }, [transformed, minCalls]);*/
   
  return (
    <>
      <Typography variant="h5" mb={3}>
        Estadísticas Históricas
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Fecha"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleFetch}>
          Buscar
        </Button>
      </Box>

      <Grid container spacing={2} mb={4} ml={4}>
        {loading && <CircularProgress sx={{ my: 4 }} />}

        {!loading &&
          entries.map(([status, count]) => {
            const bgColor = getStatusColor(status, 'bg');
            const textColor = getStatusColor(status, 'text');

            return (
              <Grid size={2} height="50%" key={status}>
                <Card
                  onClick={() => handleBoxClick(status)}
                  sx={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderLeft: `6px solid ${textColor}`,
                    boxShadow: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      {status}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {count}
                    </Typography>
                    <Chip
                      label={status}
                      sx={{
                        backgroundColor: textColor,
                        color: 'white',
                        mt: 1,
                      }}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      <Grid container spacing={2} mb={2} ml={2}>
        <Grid item xs={5}>
          <HistoricalTopPerformerCard />
        </Grid>

        <Grid item xs={3}>
          <CustomerSatisfaction />
        </Grid>

        <Grid item xs={2}>
          <HistoricalAverageResolutionTime />
        </Grid>

        <Grid item xs={2}>
          <ActiveAgents />
        </Grid>
        <Grid item sx={{ flexGrow: 1 }}>
          <Box sx={{ width: '100%' }}>
            <Card
              sx={{
                borderRadius: 3,
                height: 270,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#999', letterSpacing: 1, mb: 1 }}
                >
                  No Data Available
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        </Grid>


      <Grid container spacing={2} mb={2} ml={4}>

        <Grid size={4}>
          <HistoricalTopAgents />
        </Grid>

        <Grid size={8}>
          <HistoricalCallsByHour />
        </Grid>

        <Grid size={4}>
                  <HistoricalTicketCategoriesChart onCategoryClick={handleCategoryClick} />
                </Grid>

        <Grid size={4}>
          <HistoricalTicketRiskChart onCategoryClick={handleCategoryClick} />
        </Grid>

        <Grid size={4}>
                  <HistoricalTicketPriorityChart onCategoryClick={handleCategoryClick} />
                </Grid>
      </Grid>


      <StatusTicketsCard
        onOpenDrawer={handleOpenDrawer}
        status={selectedStatus}
        accessToken={accessTokenMSAL}
        getTicketsByStatus={getTicketsByStatus}
        date={date}
      />

      <IdsTicketsCard
        onOpenDrawer={handleOpenDrawer}
        accessToken={accessTokenMSAL}
        ids={selectedTicketIds}
        getTicketsByIds={getTicketsByIds}
        status={drawerStatus} // 👈 importante!
      />

      <RightDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        status={drawerStatus}
        tickets={drawerTickets}
      />
    </>
  );
};

export default HistoricStatistics;
