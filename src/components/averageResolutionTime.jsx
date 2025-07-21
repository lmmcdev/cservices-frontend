// src/components/averageResolutionTime.jsx

import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';
import { formatMinutesToHoursPretty } from '../utils/js/minutosToHourMinutes';

// componente base
function AverageResolutionTimeCard({ avgMinutes }) {
  const averageTime = formatMinutesToHoursPretty(avgMinutes || 0);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          borderRadius: 3,
          width: '100%',
          height: '100%',
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
            p: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#999', letterSpacing: 1, mb: 1 }}
          >
            Average Resolution Time
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: '#00a1ff' }}
          >
            {averageTime}
          </Typography>
        </CardContent>

        <AccessTimeIcon
          className="clock-icon"
          sx={{
            position: 'absolute',
            fontSize: '8rem',
            color: '#e0f7ff',
            opacity: 0.4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}
        />
      </Card>
    </Box>
  );
}

// wrappers
export function DailyAverageResolutionTime() {
  const { daily_statistics } = useDailyStatsState();
  const avg = daily_statistics?.globalStats?.avgResolutionTimeMins || 0;
  return <AverageResolutionTimeCard avgMinutes={avg} />;
}

export function HistoricalAverageResolutionTime() {
  const { stateStats } = useHistoricalStats();
  const avg = stateStats?.historic_daily_stats?.globalStats?.avgResolutionTimeMins || 0;
  return <AverageResolutionTimeCard avgMinutes={avg} />;
}

export default AverageResolutionTimeCard;
