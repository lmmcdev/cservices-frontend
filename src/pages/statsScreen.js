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

import TopAgentsSection from '../components/topAgentsSection';
import { emailToFullName } from '../utils/js/emailToFullName.js';
import TopPerformerCard from '../components/topPerformerCard';
import CallsByHourChart from '../components/callsByHourChart';
import AverageResolutionTime from '../components/averageResolutionTime';
import ActiveAgents from '../components/activeAgents.jsx';
import CustomerSatisfaction from '../components/customerSatisfaction.jsx';

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  const doneState = useDoneStatsState();
  const fetchDoneStats = useDoneFetchStatistics();

  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [minCalls, ] = useState(0);


  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);

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
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleBoxClick = (status) => {
    setSelectedStatus(status);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStatus(null);
  };

  const statistics = state.statistics || {};
  const doneStatistics = doneState.closedTickets_statistics || {};
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');
  const transformed = doneStatistics.map((item, index) => ({
      id: index + 1,
      name: item.agent_assigned,
      callsAttended: item.resolvedCount
    }));

    const filteredSortedAgents = useMemo(() => {
    return transformed
      .filter(agent => agent.callsAttended >= minCalls)
      .sort((a, b) => b.callsAttended - a.callsAttended);
  }, [transformed, minCalls]);


  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {/* Campo de búsqueda por fecha y botón */}
      <Button variant="contained" onClick={handleClick} sx={{m:2}}>Historic</Button>
      <Grid container spacing={2} mb={2}>
        {entries.map(([status, count]) => {
          const bgColor = getStatusColor(status, 'bg');
          const textColor = getStatusColor(status, 'text');

          return (
            <Grid size={2} height='50%' key={status} onClick={() => handleBoxClick(status)}>
              <Card
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

      {/* Drawer lateral reutilizable */}
      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        status={selectedStatus}
        accessToken={accessTokenMSAL}
        date={selectedDate} // 👉 Nueva prop
      />

      {/* Nueva sección de Top Agents con tabla */}
      <TopAgentsSection agents={filteredSortedAgents.map(agent => ({
        id: agent.id,
        name: emailToFullName(agent.name),
        email: agent.name,  
        cases: agent.callsAttended,
        avgTime: '1h 12m' // o algún valor mock si aún no tienes el tiempo real
      }))} />

      {/* Mensaje de felicitaciones para el Top Performer */}
      <TopPerformerCard agents={filteredSortedAgents.map(agent => ({
          ...agent,
          cases: agent.callsAttended,  // o resolvedCount
          avgTime: '1h 12m'     // si no lo tienes, ponlo como texto: '1h 15m'
        }))}
      />

      {/* Chart de total de llamadas por intervalo horario */}
      <Box mt={4}>
        <CallsByHourChart />
      </Box>

      {/* Caja que muestra el tiempo de resolucion promedio de los casos */}
      <AverageResolutionTime />

      {/* Caja que muestra numero de usuarios activos en este momento */}
      <Box mt={4}>
        <ActiveAgents />
      </Box>

      {/* Caja que muestra nivel de satisfaccion al cliente */}
      <Box mt={4}>
        <CustomerSatisfaction />
      </Box>

    </Box>
  );
}
