// src/components/topPerformerCard.jsx

import React, { useMemo, memo } from 'react';
import { Box, Typography, Card } from '@mui/material';
import confetti from 'canvas-confetti';
import { useDailyStatsState } from '../../../context/dailyStatsContext';
import { useTopAgentsStat } from '../../../context/historicalStatsContext';
import { capitalizeWords } from '../../../utils/js/capitalizeWords';

function TopPerformerCardBase({ agentStats = [], title }) {
  console.log("Permormed card")
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
    <Box sx={{ width: '100%', height: '100%', minHeight: 0 }}>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 2, sm: 3, md: 4 },          // padding responsive
          borderRadius: 3,
          boxShadow: '0px 8px 24px rgba(239,241,246,1)',
        }}
      >
        {/* Texto */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 0.5,
              fontSize: 'clamp(0.5rem, 2vw, 1.2rem)',  // mínimo 1rem, ideal 4% del ancho, máximo 1.5rem
              fontWeight: 'bold',
              whiteSpace: 'normal',  
              overflowWrap: 'break-word', 
            }}
          >
            {`Congratulations ${
              topAgent.agentEmail.includes('@')
                ? ( capitalizeWords((topAgent.agentEmail.split('@')[0]).replace(".", " ")))
                : topAgent.agentEmail
            }! 🎉`}
          </Typography>
          <Typography
            sx={{
              mb: 1.5,
              fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
              color: '#666',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              mb: 1.5,
              fontSize: 'clamp(0.85rem, 3vw, 1.1rem)',
              color: '#00A1FF',
              fontWeight: 'bold',
            }}
          >
            {topAgent.resolvedCount} Calls
          </Typography>
          <Typography
            sx={{
              fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
              color: 'text.secondary',
            }}
          >
            Avg Time: {topAgent.avgResolutionTimeMins} mins
          </Typography>
        </Box>

        {/* Trofeo */}
        <Box
          id="trophy-zone"
          onClick={handleConfetti}
          sx={{
            pl: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            minWidth: 0,
            overflow: 'hidden',
            alignSelf: 'flex-end',
            mb: { xs: 1, sm: 2 }, 
          }}
        >
          <Box
            component="img"
            src="https://res.cloudinary.com/dldi4fgyu/image/upload/v1750263284/trophy_lpzou9.png"
            alt="Trophy"
            sx={{
              width: { xs: 40, sm: 50, md: 60 },  // responsive
              height: 'auto',
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

//export memoized dailytoperformedCard
export const DailyTopPerformerCard = memo(function DailyTopPerformerCard() {
  const dailyStats = useDailyStatsState();
  const stats = dailyStats.daily_statistics || {};
  const agentStats = stats.agentStats || [];
  return <TopPerformerCardBase agentStats={agentStats} title="Top Performer – Today" />;
})

export const HistoricalTopPerformerCard = memo(function HistoricalTopPerformerCard() {

  const agentStats = useTopAgentsStat();
  return <TopPerformerCardBase agentStats={agentStats} title="Top Performer – Historical" />;
});