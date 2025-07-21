// src/components/topPerformerCard.jsx

import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid} from '@mui/material';
import confetti from 'canvas-confetti';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

const formatName = email => email?.split('@')[0] || 'Unknown';

// ✅ Componente Base reutilizable
function TopPerformerCardBase({ agentStats = [], title }) {
  const topAgent = useMemo(() => {
    const statsArray = agentStats?.length
      ? agentStats
      : [{
          agentEmail: 'no agent detected',
          avgResolutionTimeMins: 0,
          resolvedCount: 0,
        }];

    const sorted = [...statsArray].sort((a, b) => {
      if (b.resolvedCount === a.resolvedCount) {
        return a.avgResolutionTimeMins - b.avgResolutionTimeMins;
      }
      return b.resolvedCount - a.resolvedCount;
    });

    return sorted[0] || null;
  }, [agentStats]);

  const handleConfetti = () => {
    const trophyBox = document.getElementById('trophy-zone');
    if (!trophyBox) return;
    const rect = trophyBox.getBoundingClientRect();
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 32,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      zIndex: 9999,
    });
  };

  if (!topAgent) return null;

return (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      minHeight: {
        xs: '200px', // <600px
        sm: '250px', // ≥600px
        md: '300px', // ≥900px
        lg: '350px', // ≥1200px
        xl: '400px', // ≥1536px
      },
    }}
  >
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
        borderRadius: 3,
        boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
      }}
    >
      {/* Texto */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          {topAgent.agentEmail.includes('@')
            ? topAgent.agentEmail.split('@')[0]
            : topAgent.agentEmail}
          ! 🎉
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontSize: '1rem', color: '#666' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#00A1FF', fontWeight: 'bold', mb: 2 }}>
          {topAgent.resolvedCount} Calls
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
          Avg Time: {topAgent.avgResolutionTimeMins} mins
        </Typography>
      </Box>

      {/* Trofeo */}
      <Box
        id="trophy-zone"
        sx={{
          pl: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleConfetti}
      >
        <Box
          component="img"
          src="https://res.cloudinary.com/dldi4fgyu/image/upload/v1750263284/trophy_lpzou9.png"
          alt="Trophy"
          sx={{ width: 60, height: 'auto' }}
        />
      </Box>
    </Card>
  </Box>
);

}


export function DailyTopPerformerCard() {
  const dailyStats = useDailyStatsState();
  const stats = dailyStats.daily_statistics || {};
  const agentStats = stats.agentStats || [];
  return <TopPerformerCardBase agentStats={agentStats} title="Top Performer – Today" />;
}

// ✅ Variante para estadísticas históricas
export function HistoricalTopPerformerCard() {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  const agentStats = stats.agentStats || [];
  return <TopPerformerCardBase agentStats={agentStats} title="Top Performer – Historical" />;
}
