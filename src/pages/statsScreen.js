// src/pages/statsScreen.js
import React, { useEffect, useState, useMemo } from 'react';
import { useStatsState, useFetchStatistics } from '../context/statsContext';
import { useDoneStatsState, useDoneFetchStatistics } from '../context/doneTicketsContext';
import { useMsal } from '@azure/msal-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';
import RightDrawer from '../components/rightDrawer';
import { useNavigate } from 'react-router-dom';

import TopPerformerCard from '../components/topPerformerCard';
import { DailyCallsByHour } from '../components/callsByHourChart';
import AverageResolutionTime from '../components/averageResolutionTime';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';
import StatusTicketsCard from '../components/ticketsByStatusBoard.js';
import IdsTicketsCard from '../components/ticketsByIdsBoard.js';
import { getTicketsByStatus, getTicketsByIds } from '../utils/apiStats';
import {DailyTicketRiskChart} from '../components/ticketsRiskChart.jsx';
import { DailyTopAgents } from '../components/topAgentsSection';
import { DailyTicketCategoriesChart } from '../components/ticketsCategoriesChart.jsx';
import { DailyTicketPriorityChart } from '../components/ticketsPriorityChart.jsx';

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  const doneState = useDoneStatsState();
  const fetchDoneStats = useDoneFetchStatistics();

  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerStatus, setDrawerStatus] = useState('');
  const [drawerTickets, setDrawerTickets] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [minCalls] = useState(0);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);


  const time = Date.now();
  const today = new Date(time);
  const selectedDate = today.toLocaleDateString();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/historical_statistics');
  };

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


  const statistics = state.statistics || {};

  const doneStatistics = doneState.closedTickets_statistics || {};
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');
  const transformed = doneStatistics.map((item, index) => ({
    id: index + 1,
    name: item.agent_assigned,
    callsAttended: item.resolvedCount,
  }));

  const filteredSortedAgents = useMemo(() => {
    return transformed
      .filter(agent => agent.callsAttended >= minCalls)
      .sort((a, b) => b.callsAttended - a.callsAttended);
  }, [transformed, minCalls]);

  return (
    <>
        <Button variant="contained" onClick={handleClick} sx={{ m: 2 }}>
          Historic
        </Button>
     
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          ml: 4,
          mb: 4,
          width: 'calc(100% - 32px)', // ajuste del margin izquierdo
        }}
      >
        {[...entries, ['Total', statistics.total]].map(([status, count]) => {
          const bgColor = getStatusColor(status, 'bg');
          const textColor = getStatusColor(status, 'text');

          return (
            <Box
              key={status}
              sx={{
                flex: 1, // hace que todos crezcan proporcionalmente
              }}
              onClick={status === 'Total' ? undefined : () => handleBoxClick(status)}
            >
              <Card
                sx={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderLeft: `6px solid ${textColor}`,
                  boxShadow: 2,
                  cursor: status === 'Total' ? 'default' : 'pointer',
                  '&:hover': {
                    transform: status === 'Total' ? 'none' : 'scale(1.03)',
                  },
                  transition: 'transform 0.2s',
                  height: '100%',
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
            </Box>
          );
        })}
      </Box>

      <Grid container spacing={2} mb={2} ml={4}>
        <Grid size={4}>
          <DailyTopAgents />
        </Grid>

        <Grid size={8}>
          <DailyCallsByHour />
        </Grid>

        <Grid size={4}>
          <DailyTicketCategoriesChart onCategoryClick={handleCategoryClick} />
        </Grid>

        <Grid size={4}>
          <DailyTicketRiskChart onCategoryClick={handleCategoryClick} />
        </Grid>

        <Grid size={4}>
          <DailyTicketPriorityChart onCategoryClick={handleCategoryClick} />
        </Grid>

        <Grid size={2}>
              <AverageResolutionTime />

        </Grid>
    
        <Box sx={{ flexGrow: 1, p: 1 }}>
          <StatusTicketsCard
              onOpenDrawer={handleOpenDrawer}
              status={selectedStatus}
              accessToken={accessTokenMSAL}
              getTicketsByStatus={getTicketsByStatus}
              date={selectedDate}
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
      

      

       

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
        {/* Columna izquierda: TopAgentsSection + CustomerSatisfaction + AvgTime */}
        <Box>
          

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '320px' }}>
              <CustomerSatisfaction />
            </Box>
            <Box sx={{ width: '320px' }}>
              
            </Box>
            <Box sx={{ width: '250px' }}>
            </Box>
          </Box>
        </Box>

        {/* Columna derecha: Felicitaciones + Active Agents + Gráfico */}
        <Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '470px' }}>
              <TopPerformerCard
                agents={filteredSortedAgents.map(agent => ({
                  ...agent,
                  cases: agent.callsAttended,
                  avgTime: '1h 12m'
                }))}
              />
            </Box>

            <Box sx={{ width: '320px' }}>
              <ActiveAgents />
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
    </Grid>
    </>
  );
}
