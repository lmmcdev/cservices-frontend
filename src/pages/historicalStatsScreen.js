// src/screens/HistoricStatistics.jsx
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
  useHistoricalStatsState,
  useFetchHistoricalStatistics,
} from '../context/historicalStatsContext';
import RightDrawer from '../components/rightDrawer';
import { getStatusColor } from '../utils/js/statusColors';

const HistoricStatistics = () => {
  const { accounts, instance } = useMsal();
  const state = useHistoricalStatsState();
  const fetchHistoricalStatistics = useFetchHistoricalStatistics();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
const [accessTokenMSAL, setAccessTokenMSAL] = useState(null);
  

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
          await fetchHistoricalStatistics(accessToken, date); // 👉 Pasa la fecha al cargar
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
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');

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
