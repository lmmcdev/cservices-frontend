import React, { useEffect, useState } from 'react';
import { useStatsState, useFetchStatistics } from '../context/statsContext';
import { useMsal } from '@azure/msal-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Drawer,
  IconButton,
} from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';
import CloseIcon from '@mui/icons-material/Close';

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Cargar estadísticas al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
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
          await fetchStatistics(accessToken);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, []);

  const statistics = state.statistics || {};
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');

  const handleBoxClick = (status) => {
    setSelectedStatus(status);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStatus(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} mb={2}>
        {entries.map(([status, count]) => {
          const bgColor = getStatusColor(status, 'bg');
          const textColor = getStatusColor(status, 'text');

          return (
            <Grid  size={3} height='50%' key={status} onClick={() => handleBoxClick(status)}>
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

      {/* Drawer lateral */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { width: 400, p: 2 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Detalles de {selectedStatus}</Typography>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Aquí puedes agregar la tabla o cualquier contenido que desees */}
        <Typography variant="body1">
          Aquí puedes mostrar la tabla de tickets filtrados por estado: {selectedStatus}
        </Typography>
      </Drawer>
    </Box>
  );
}
