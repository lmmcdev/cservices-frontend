// src/components/TopPerformerCard.jsx
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { emailToFullName } from '../utils/js/emailToFullName';
import confetti from 'canvas-confetti';

function parseAvgTime(timeStr) {
  if (!timeStr) return 9999;
  const [hours, minutes] = timeStr.split(' ').map(part => parseInt(part));
  return (isNaN(hours) ? 0 : hours) * 60 + (isNaN(minutes) ? 0 : minutes);
}

export default function TopPerformerCard({ agents = [] }) {
  const now = new Date();
  const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevMonthName = firstDayPrevMonth.toLocaleString('default', { month: 'long' });

  const topAgent = useMemo(() => {
    if (!Array.isArray(agents) || agents.length === 0) return null;

    const scored = agents.map(agent => {
      const prevMonthCases = Array.isArray(agent.cases)
        ? agent.cases.filter(c => {
            const d = new Date(c.date);
            return d >= firstDayPrevMonth && d <= lastDayPrevMonth;
          })
        : [];

      return {
        ...agent,
        prevMonthCaseCount: prevMonthCases.length
      };
    });

    const sorted = scored.sort((a, b) => {
      if (b.prevMonthCaseCount === a.prevMonthCaseCount) {
        return parseAvgTime(a.avgTime) - parseAvgTime(b.avgTime);
      }
      return b.prevMonthCaseCount - a.prevMonthCaseCount;
    });

    return sorted[0] || null;
  }, [agents]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfetti = () => {
    const trophyBox = document.getElementById('trophy-zone');
    if (!trophyBox) return;

    const rect = trophyBox.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 32,
      origin: { x, y },
      zIndex: 9999
    });
  };

  if (!topAgent) return null;

  return (
    <Card
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        p: 2,
        boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        maxWidth: 470,
        mx: 'auto',
        mt: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Congratulations {emailToFullName(topAgent.name)}! 🎉
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Top Performer – {prevMonthName}
        </Typography>
        <Typography variant="h4" sx={{ color: '#00A1FF', fontWeight: 'bold' }}>
          {(topAgent.prevMonthCaseCount || 0).toLocaleString()} Calls
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Average time: {topAgent.avgTime || '—'}
        </Typography>
      </CardContent>
      <Box
        id="trophy-zone"
        sx={{ pr: 3, alignSelf: 'center', mt: 4, cursor: 'pointer' }}
        onClick={handleConfetti}
      >
        <Box
          component="img"
          src="https://res.cloudinary.com/dldi4fgyu/image/upload/v1750263284/trophy_lpzou9.png"
          alt="Trophy"
          sx={{ width: 80, height: 'auto' }}
        />
      </Box>
    </Card>
  );
}
