// src/screens/HistoricStatistics.jsx
import React, { useState, useMemo } from 'react';
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
  useHistoricalStatsState,
  useFetchHistoricalStatistics,
} from '../context/historicalStatsContext';
import { useHistoricalDoneStatsState, useHistoricalDoneFetchStatistics } from '../context/doneHistoricalTicketsContext';
import RightDrawer from '../components/rightDrawer';
import { getStatusColor } from '../utils/js/statusColors';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const HistoricStatistics = () => {
  const { accounts, instance } = useMsal();
  const state = useHistoricalStatsState();
  const fetchHistoricalStatistics = useFetchHistoricalStatistics();
  const stateDone = useHistoricalDoneStatsState();
  const fetchHistoricalDoneTickets = useHistoricalDoneFetchStatistics();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);

    const [minCalls, setMinCalls] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;
  
  

  const handleFetch = async () => {
    if (!date) return;

    try {
      setLoading(true);

      const accessToken = await instance
          .acquireTokenSilent({
            scopes: ['User.Read'], // Cambia este scope al que uses en tu API
            account: accounts[0],
          })
          .then(response => response.accessToken)
          .catch(error => {
            console.error('Error acquiring token', error);
            return null;
          });

        if (accessToken) {
          setAccessTokenMSAL(accessToken);
          await fetchHistoricalStatistics(accessToken, date);
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
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStatus(null);
  };
  const statistics = state.historical_statistics || [];
  const doneStatistics = stateDone.closedHistoricalTickets_statistics || [];
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');

  //grafico de agentes
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

  console.log(doneStatistics)
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
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
        
        <Grid container spacing={2} mb={2}>
      

      {loading && <CircularProgress sx={{ my: 4 }} />}

      {!loading && (
            <>
          {entries.map(([status, count]) => {
            const bgColor = getStatusColor(status, 'bg');
            const textColor = getStatusColor(status, 'text');

            return (
              <Grid size={2} height='50%' key={status} onClick={() => handleBoxClick(status)}>
                <Card
                  onClick={() => setSelectedStatus(status)}
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
        </>
      )}
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
                date={date} // 👉 Nueva prop
              />
    </Box>
  );
};

export default HistoricStatistics;
