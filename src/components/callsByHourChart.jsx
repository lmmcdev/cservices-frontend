import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, Box, Typography } from '@mui/material';

const data = [
  /*{ hour: '1 AM', calls: 8 },
  { hour: '2 AM', calls: 5 },
  { hour: '3 AM', calls: 2 },
  { hour: '4 AM', calls: 1 },
  { hour: '5 AM', calls: 3 },
  { hour: '6 AM', calls: 6 },*/
  { hour: '7 AM', calls: 11 },
  { hour: '8 AM', calls: 14 },
  { hour: '9 AM', calls: 20 },
  { hour: '10 AM', calls: 18 },
  { hour: '11 AM', calls: 15 },
  { hour: '12 PM', calls: 22 },
  { hour: '1 PM', calls: 19 },
  { hour: '2 PM', calls: 16 },
  { hour: '3 PM', calls: 21 },
  { hour: '4 PM', calls: 17 },
  { hour: '5 PM', calls: 23 },
  /*{ hour: '6 PM', calls: 18 },
  { hour: '7 PM', calls: 20 },
  { hour: '8 PM', calls: 14 },
  { hour: '9 PM', calls: 10 },
  { hour: '10 PM', calls: 6 },
  { hour: '11 PM', calls: 3 },*/
];

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: 2,
          minWidth: 120, // 👈 ajusta el ancho aquí
        }}
      >
        <Typography fontWeight="bold">{label}</Typography>
        <Typography fontSize={14}>Calls: {payload[0].value}</Typography>
      </Box>
    );
  }
  return null;
};

export default function CallsByHourChart() {
  return (
    <Box sx={{ maxWidth: 950, mx: 'auto', mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)' }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00a1ff" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00a1ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" interval={0} angle={-35} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip
                cursor={{ strokeDasharray: '4 5', strokeWidth: 1 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#00a1ff"
                fill="url(#colorCalls)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

