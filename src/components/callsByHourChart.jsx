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

// 📊 Tus datos
const data = [
  { hour: '7 AM - 8 AM', calls: 103 },
  { hour: '8 AM - 9 AM', calls: 233 },
  { hour: '9 AM - 10 AM', calls: 286 },
  { hour: '10 AM - 11 AM', calls: 352 },
  { hour: '11 AM - 12 PM', calls: 362 }, // 🔥
  { hour: '12 PM - 1 PM', calls: 227 },
  { hour: '1 PM - 2 PM', calls: 257 },
  { hour: '2 PM - 3 PM', calls: 257 },
  { hour: '3 PM - 4 PM', calls: 211 },
  { hour: '4 PM - 5 PM', calls: 131 },
  { hour: '5 PM - 6 PM', calls: 7 }, // 😴
];

// 🔍 Máximo y mínimo
const maxCalls = Math.max(...data.map(d => d.calls));
const minCalls = Math.min(...data.map(d => d.calls));

// 🔧 Tooltip personalizado con efectos especiales
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isMax = value === maxCalls;
    const isMin = value === minCalls;

    return (
      <Box
        sx={{
          background: isMax
            ? 'linear-gradient(300deg, #ff3c00 20%, #ff9a00 100%)'
            : isMin
            ? 'linear-gradient(300deg, #4a148c 20%, #7b1fa2 100%)'
            : '#fff',
          color: isMax || isMin ? '#fff' : '#000',
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: 2,
          minWidth: 120,
          position: 'relative',
          boxShadow: isMax
            ? '0 0 10px rgba(255, 60, 0, 0.6)'
            : isMin
            ? '0 0 10px rgba(123, 31, 162, 0.4)'
            : 'none',
          animation: isMax
            ? 'burn 0.5s infinite alternate'
            : isMin
            ? 'zzz 2s infinite ease-in-out'
            : 'none',
        }}
      >
        <Typography fontWeight="bold">{label}</Typography>
        <Typography fontSize={14}>Calls: {value}</Typography>

        {isMax && (
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

        {isMin && (
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

// 💫 Animaciones
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

export default function CallsByHourChart() {
  return (
    <>
      <style>{animations}</style>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)' }}>
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mt: 2, mb: 3, ml: 2, color: '#000' }}
            >
              Total Calls by Hour Interval
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data} margin={{ top: 30, right: 60, left: 60, bottom: 20 }}>
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
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 5', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#00a1ff"
                  fill="url(#colorCalls)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                >
                  <LabelList
                    dataKey="calls"
                    position="top"
                    style={{ fontSize: 16, fontWeight: 'bold', fill: '#333' }}
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
