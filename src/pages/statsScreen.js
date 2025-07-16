// src/pages/statsScreen.js
import React, { useEffect, useState } from 'react';
import { useStatsState, useFetchStatistics } from '../context/statsContext';
import { useDoneFetchStatistics } from '../context/doneTicketsContext';
import { useMsal } from '@azure/msal-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';
import RightDrawer from '../components/rightDrawer';

import { DailyCallsByHour } from '../components/callsByHourChart';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';
import StatusTicketsCard from '../components/ticketsByStatusBoard.js';
import IdsTicketsCard from '../components/ticketsByIdsBoard.js';
import { getTicketsByStatus, getTicketsByIds } from '../utils/apiStats';
import {DailyTicketRiskChart} from '../components/ticketsRiskChart.jsx';
import { DailyTopAgents } from '../components/topAgentsSection';
import { DailyTicketCategoriesChart } from '../components/ticketsCategoriesChart.jsx';
import { DailyTicketPriorityChart } from '../components/ticketsPriorityChart.jsx';
import { DailyAverageResolutionTime } from '../components/averageResolutionTime';
import { DailyTopPerformerCard } from '../components/topPerformerCard';

import FloatingSettingsButton from '../components/components/floatingSettingsButton';

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  //const doneState = useDoneStatsState();
  const fetchDoneStats = useDoneFetchStatistics();

  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerStatus, setDrawerStatus] = useState('');
  const [drawerTickets, setDrawerTickets] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  //const [minCalls] = useState(0);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);


  const time = Date.now();
  const today = new Date(time);
  const selectedDate = today.toLocaleDateString();
  

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
    <FloatingSettingsButton/>     
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
        <Grid item xs={5}>
          <DailyTopPerformerCard />
        </Grid>

        <Grid item xs={3}>
          <CustomerSatisfaction />
        </Grid>

        <Grid item xs={2}>
          <DailyAverageResolutionTime />
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
    </Box>
    </Grid>
    </>
  );
}
