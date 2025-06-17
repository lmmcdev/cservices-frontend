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
  Button
} from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';
import RightDrawer from '../components/rightDrawer';
 import { useNavigate } from 'react-router-dom';

export default function StatsScreen() {
  const state = useStatsState();
  const fetchStatistics = useFetchStatistics();
  const { accounts, instance } = useMsal();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
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
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBoxClick = (status) => {
    setSelectedStatus(status);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStatus(null);
  };

  const statistics = state.statistics || {};
  const entries = Object.entries(statistics).filter(([key]) => key !== 'total');

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
    </Box>
  );
}
