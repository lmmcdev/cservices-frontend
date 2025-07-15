import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';
import { formatMinutesToHoursPretty } from '../utils/js/minutosToHourMinutes';

// ✅ Componente base reutilizable
function AverageResolutionTimeCard({ avgMinutes }) {
  const averageTime = formatMinutesToHoursPretty(avgMinutes || 0);

  return (
    <Box sx={{ width: 350 }}>
      <Card
        sx={{
          borderRadius: 3,
          height: 270,
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

// ✅ Wrapper para Daily Stats
export function DailyAverageResolutionTime() {
  const { daily_statistics } = useDailyStatsState();
  const avgMinutes = daily_statistics?.globalStats?.avgResolutionTimeMins || 0;
  return <AverageResolutionTimeCard avgMinutes={avgMinutes} />;
}

// ✅ Wrapper para Historical Stats
export function HistoricalAverageResolutionTime() {
  const { stateStats } = useHistoricalStats();
  const avgMinutes = stateStats?.historic_globalStats?.avgResolutionTimeMins || 0;
  return <AverageResolutionTimeCard avgMinutes={avgMinutes} />;
}

export default AverageResolutionTimeCard;
