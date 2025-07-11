import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // ⏱️
import { useDailyStatsState } from '../context/dailyStatsContext';
import { formatMinutesToHoursPretty } from '../utils/js/minutosToHourMinutes';


export default function AverageResolutionTime() {
  //const averageTime = '2h 14m';
  const { daily_statistics } = useDailyStatsState();
  const globalStats = daily_statistics?.globalStats || [];

  const averageTime = formatMinutesToHoursPretty(globalStats.avgResolutionTimeMins)
  return (
    <Box>
      <Card
        sx={{
          borderRadius: 3,
          height: 240,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          backgroundColor: '#fff',
          '&:hover .clock-icon': {
            transform: 'translate(-50%, -50%) rotate(360deg)',
            transition: 'transform 0.8s ease-in-out',
          },
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
            Average Resolution Time
          </Typography>

          {/* Número envuelto para controlar hover */}
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: '#00a1ff' }}
            >
              {averageTime}
            </Typography>
          </Box>
        </CardContent>

        {/* Ícono del reloj con clase para animación */}
        <AccessTimeIcon
          className="clock-icon"
          sx={{
            position: 'absolute',
            fontSize: 180,
            color: '#e0f7ff',
            opacity: 0.4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            transition: 'transform 0.8s ease-in-out',
          }}
        />
      </Card>
    </Box>
  );
}
