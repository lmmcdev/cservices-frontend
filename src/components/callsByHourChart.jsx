// src/components/callsByHourChart.jsx

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  LabelList,
} from 'recharts';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

// Animaciones CSS para tooltip
const animations = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes sleepy {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes burn {
    0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
    100% { transform: scale(1.02) rotate(0.3deg); filter: brightness(1.1); }
  }
  @keyframes zzz {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(0.98); }
  }
`;

const CustomTooltip = ({ active, payload, label, maxCalls, minCalls }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const idx = payload[0].payload.index;
    const isFirstMax = value === maxCalls && idx === payload[0].payload.firstMaxIndex;
    const isFirstMin = value === minCalls && idx === payload[0].payload.firstMinIndex;

    return (
      <Box
        sx={{
          background: isFirstMax
            ? 'linear-gradient(300deg, #ff3c00 20%, #ff9a00 100%)'
            : isFirstMin
            ? 'linear-gradient(300deg, #4a148c 20%, #7b1fa2 100%)'
            : '#fff',
          color: isFirstMax || isFirstMin ? '#fff' : '#000',
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 2,
          minWidth: 120,
          boxShadow: isFirstMax
            ? '0 0 10px rgba(255, 60, 0, 0.6)'
            : isFirstMin
            ? '0 0 10px rgba(123, 31, 162, 0.4)'
            : 'none',
          animation: isFirstMax
            ? 'burn 0.5s infinite alternate'
            : isFirstMin
            ? 'zzz 2s infinite ease-in-out'
            : 'none',
        }}
      >
        <Typography fontWeight="bold">{label}</Typography>
        <Typography fontSize={14}>Calls: {value}</Typography>
        {isFirstMax && (
          <Box
            sx={{
              position: 'absolute',
              top: -25,
              right: -10,
              fontSize: 30,
              animation: 'bounce 0.8s infinite',
            }}
          >
            🔥
          </Box>
        )}
        {isFirstMin && (
          <Box
            sx={{
              position: 'absolute',
              top: -25,
              right: -10,
              fontSize: 30,
              animation: 'sleepy 1s infinite',
            }}
          >
            😴
          </Box>
        )}
      </Box>
    );
  }
  return null;
};

export default function CallsByHourChart({ stats }) {
  const workHours = Array.from({ length: 12 }, (_, i) => i + 6);
  const raw = stats?.hourlyBreakdown || [];
  const map = new Map(raw.map(item => [item.hour, item.count]));
  const data = workHours.map(hour => {
    const count = map.get(hour) ?? 0;
    const next = (hour + 1) % 24;
    const fmt = h => {
      const p = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 === 0 ? 12 : h % 12;
      return `${hr} ${p}`;
    };
    return { hour: `${fmt(hour)} - ${fmt(next)}`, calls: count };
  });

  const calls = data.map(d => d.calls);
  const maxCalls = Math.max(...calls, 0);
  const minCalls = Math.min(...calls, 0);
  const firstMaxIndex = data.findIndex(d => d.calls === maxCalls);
  const firstMinIndex = data.findIndex(d => d.calls === minCalls);
  const enriched = data.map((d, i) => ({ ...d, index: i, firstMaxIndex, firstMinIndex }));

  return (
    <>
      <style>{animations}</style>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0px 8px 24px rgba(239,241,246,1)' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              p: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Total Calls by Hour Interval
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enriched} margin={{ top: 30, right: 40, left: 40, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00a1ff" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#00a1ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="hour"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip maxCalls={maxCalls} minCalls={minCalls} />} />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="#00a1ff"
                    fill="url(#colorCalls)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  >
                    <LabelList dataKey="calls" position="top" style={{ fontSize: 12, fontWeight: 'bold', fill: '#333' }} />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

// Daily wrapper
export function DailyCallsByHour() {
  const { daily_statistics } = useDailyStatsState();
  return <CallsByHourChart stats={daily_statistics || {}} />;
}

// Historical wrapper
export function HistoricalCallsByHour() {
  const { stateStats } = useHistoricalStats();
  return <CallsByHourChart stats={stateStats.historic_daily_stats || {}} />;
}
