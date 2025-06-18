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
  TextField,
  Button,
} from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';
import RightDrawer from '../components/rightDrawer';
 import { useNavigate } from 'react-router-dom';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  const doneState = useDoneStatsState();
  const fetchDoneStats = useDoneFetchStatistics();

  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [minCalls, setMinCalls] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Simular datos de agentes
  /*const allAgents = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      name: `Agent ${i + 1}`,
      callsAttended: Math.floor(Math.random() * 200),
    }));
  }, []);*/

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

  const currentPageAgents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSortedAgents.slice(start, start + pageSize);
  }, [filteredSortedAgents, page]);

  const totalPages = Math.ceil(filteredSortedAgents.length / pageSize);
  //console.log(transformed)

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


      <Box mt={4} mb={2} textAlign="center">
        <Typography variant="h6" color="#4858FF">
          Agent Activity - Top {pageSize}
        </Typography>
        <Box mt={1} display="flex" justifyContent="center" alignItems="center" gap={1}>
          <Typography fontSize={14}>Min. calls:</Typography>
          <TextField
            type="number"
            size="small"
            value={minCalls}
            onChange={(e) => {
              setPage(1);
              setMinCalls(Number(e.target.value));
            }}
            inputProps={{ min: 0 }}
            sx={{ width: 100 }}
          />
        </Box>
      </Box>

      {/* Gráfico de barras */}
      <Box height={400}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentPageAgents}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="callsAttended" fill="#4858FF" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Paginación */}
      <Box mt={3} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <Typography fontSize={14}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Box>
      
      {/* Drawer lateral reutilizable */}
      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        status={selectedStatus}
        accessToken={accessTokenMSAL}
        date={selectedDate} // 👉 Nueva prop
      />
    </Box>
  );
}
