import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import confetti from 'canvas-confetti';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

// ✅ Función para mostrar nombre legible
const formatName = email => email?.split('@')[0] || 'Unknown';

// ✅ Componente Base reutilizable
function TopPerformerCardBase({ agentStats = [], title }) {
  const topAgent = useMemo(() => {
  const statsArray = (agentStats && agentStats.length > 0)
    ? agentStats
    : [{
        agentEmail: "no agent detected",
        avgResolutionTimeMins: 0,
        resolvedCount: 0
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
    <Card
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        p: 5,
        boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        maxWidth: 300,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 270,
        width: '100%',
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          {formatName(topAgent.agentEmail)}! 🎉
        </Typography>
        <Typography variant="p" sx={{ mb: 2, fontSize: '1rem', color: '#666' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#00A1FF', fontWeight: 'bold', mb: 2 }}>
          {topAgent.resolvedCount} Calls
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
          Avg Time: {topAgent.avgResolutionTimeMins} mins
        </Typography>
      </CardContent>
      <Box
        id="trophy-zone"
        sx={{ pr: 1, alignSelf: 'center', mt: 5, cursor: 'pointer' }}
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
  );
}

// ✅ Variante para estadísticas diarias
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

export default TopPerformerCardBase;
