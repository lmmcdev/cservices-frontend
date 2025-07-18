import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';
import { formatMinutesToHoursPretty } from '../utils/js/minutosToHourMinutes';

function AverageResolutionTimeCard({ avgMinutes }) {
  const averageTime = formatMinutesToHoursPretty(avgMinutes || 0);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
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
            sx={{ color: '#999', letterSpacing: 1, mb: 0.5 }}
          >
            Average Resolution Time
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: '#00a1ff', lineHeight: 1 }}
          >
            {averageTime}
          </Typography>
        </CardContent>

        <AccessTimeIcon
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

// Wrapper para Daily
export function DailyAverageResolutionTime() {
  const { daily_statistics } = useDailyStatsState();
  const avgMinutes = daily_statistics?.globalStats?.avgResolutionTimeMins || 0;
  return <AverageResolutionTimeCard avgMinutes={avgMinutes} />;
}

// Wrapper para Histórico
export function HistoricalAverageResolutionTime() {
  const { stateStats } = useHistoricalStats();
  const avgMinutes =
    stateStats?.historic_daily_stats?.globalStats?.avgResolutionTimeMins || 0;
  return <AverageResolutionTimeCard avgMinutes={avgMinutes} />;
}

export default AverageResolutionTimeCard;
